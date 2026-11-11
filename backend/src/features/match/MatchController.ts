import { Response } from 'express';
import { Op } from 'sequelize';
import { Conversation, DatingEvent, Match, Message, User, UserBlock, UserSwipe } from '../../models';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { ALGORITHM_VERSION, compatibility, DatingProfile } from './compatibility';
import { datingTransaction, lockPair } from './transactions';
import { profileIncludes, publicProfile } from './profiles';
import { datingError, formatMatch, recordSwipe } from './swipes';

const allowed = (req: AuthRequest, userId: unknown) => req.user?.id === userId || req.user?.role === 'ADMIN';
const handleError = (res: Response, error: any) => {
  if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
  console.error('Dating request failed:', error);
  return res.status(500).json({ error: 'Internal server error' });
};

async function blockedIds(userId: string) {
  const blocks = await UserBlock.findAll({ where: { [Op.or]: [{ user_id: userId }, { target_id: userId }] } });
  return new Set(blocks.map(block => block.get('user_id') === userId ? block.get('target_id') : block.get('user_id')));
}

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;
    if (!allowed(req, userId)) return res.status(403).json({ error: 'Forbidden' });
    const [viewer, matches, blocked] = await Promise.all([
      User.findByPk(userId, { include: profileIncludes() }),
      Match.findAll({ where: { [Op.or]: [{ user1_id: userId }, { user2_id: userId }] } }),
      blockedIds(userId),
    ]);
    if (!viewer) return res.status(404).json({ error: 'User not found' });
    const profile = viewer.toJSON() as DatingProfile;
    const ids = matches.map(record => record.get('user1_id') === userId ? record.get('user2_id') : record.get('user1_id')).filter(id => !blocked.has(id));
    const partners = ids.length ? await User.findAll({
      where: { id: { [Op.in]: ids }, status: 'ACTIVE' },
      attributes: { exclude: ['password', 'email', 'app_logo'] }, include: profileIncludes(),
    }) : [];
    const byId = new Map(partners.map(partner => [partner.get('id'), partner.toJSON() as DatingProfile]));
    const formatted = matches.flatMap(record => {
      const match = record.toJSON();
      const targetId = match.user1_id === userId ? match.user2_id : match.user1_id;
      const target = byId.get(targetId);
      if (!target) return [];
      return [formatMatch(match, userId, target, compatibility(profile, target).score)];
    }).sort((a, b) => (b.match_percentage ?? -1) - (a.match_percentage ?? -1) || new Date(b.matched_at).getTime() - new Date(a.matched_at).getTime());
    return res.json(formatted);
  } catch (error) { return handleError(res, error); }
};

const swipeHandler = (action: 'like' | 'superlike' | 'pass') => async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    const result = await recordSwipe(req.user.id, req.body?.targetId, action, req.body?.requestId);
    return res.json(action === 'pass' ? { success: true } : result);
  } catch (error) { return handleError(res, error); }
};

export const likeUser = swipeHandler('like');
export const superlikeUser = swipeHandler('superlike');
export const passUser = swipeHandler('pass');

export const unmatch = async (req: AuthRequest, res: Response) => {
  try {
    const found: any = await Match.findByPk(req.params.id as string);
    if (!found) return res.status(404).json({ error: 'Match not found' });
    if (!allowed(req, found.user1_id) && !allowed(req, found.user2_id)) return res.status(403).json({ error: 'Forbidden' });
    await datingTransaction(async transaction => {
      const pair = await lockPair(found.user1_id, found.user2_id, transaction);
      const match: any = await Match.findByPk(req.params.id as string, { transaction });
      if (!match) throw datingError('Match not found', 404);
      if (!allowed(req, match.user1_id) && !allowed(req, match.user2_id)) throw datingError('Forbidden', 403);
      await pair.update({ state: 'unmatched' }, { transaction });
      await DatingEvent.create({ user_id: req.user.id, target_id: match.user1_id === req.user.id ? match.user2_id : match.user1_id,
        type: 'unmatch', algorithm_version: ALGORITHM_VERSION }, { transaction });
      // Preserve the decision even for historical matches which have no swipe records.
      for (const [user_id, target_id] of [[match.user1_id, match.user2_id], [match.user2_id, match.user1_id]]) {
        await UserSwipe.upsert({ user_id, target_id, action: 'pass', updated_at: new Date() }, { transaction });
      }
      const conversations = await Conversation.findAll({ where: { match_id: match.id }, transaction });
      const ids = conversations.map(conversation => conversation.get('id'));
      if (ids.length) await Message.destroy({ where: { conversation_id: { [Op.in]: ids } }, transaction });
      await Conversation.destroy({ where: { match_id: match.id }, transaction });
      await match.destroy({ transaction });
    });
    return res.json({ success: true });
  } catch (error) { return handleError(res, error); }
};

const likedUsers = (incoming: boolean) => async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;
    if (!allowed(req, userId)) return res.status(403).json({ error: 'Forbidden' });
    const [viewer, swipes, blocked] = await Promise.all([
      User.findByPk(userId, { include: profileIncludes() }),
      UserSwipe.findAll({
        where: { [incoming ? 'target_id' : 'user_id']: userId, action: { [Op.in]: ['like', 'superlike'] } },
        order: [['updated_at', 'DESC']],
      }),
      blockedIds(userId),
    ]);
    const ids = swipes.map(swipe => swipe.get(incoming ? 'user_id' : 'target_id') as string).filter(id => !blocked.has(id));
    if (!viewer || !ids.length) return res.json([]);
    const users = await User.findAll({ where: { id: { [Op.in]: ids }, status: 'ACTIVE', role: 'USER' }, include: profileIncludes() });
    const byId = new Map(users.map(user => [user.get('id'), user.toJSON() as DatingProfile]));
    return res.json(ids.filter(id => byId.has(id)).map(id => {
      const profile = byId.get(id)!;
      return { ...publicProfile(profile), match_percentage: compatibility(viewer.toJSON() as DatingProfile, profile).score };
    }));
  } catch (error) { return handleError(res, error); }
};

export const getWhoLikedMe = likedUsers(true);
export const getWhoILiked = likedUsers(false);
