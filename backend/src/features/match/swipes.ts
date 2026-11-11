import { createHash, randomUUID } from 'node:crypto';
import { Op, UniqueConstraintError } from 'sequelize';
import { Conversation, DatingEvent, DatingRequest, Match, Notification, User, UserBlock, UserSwipe } from '../../models';
import { ALGORITHM_VERSION, compatibility, DatingProfile, mutuallyEligible } from './compatibility';
import { profileIncludes, publicProfile } from './profiles';
import { datingTransaction, lockPair } from './transactions';

export const PASS_COOLDOWN_DAYS = 30;
export function datingError(message: string, statusCode = 400, code?: string) {
  return Object.assign(new Error(message), { statusCode, code });
}
export function formatMatch(match: any, userId: string, target: any, score: number | null, isNew = false) {
  return {
    id: match.id, user_id: userId, matched_user_id: target.id,
    matched_user: publicProfile(target), match_percentage: score,
    matched_at: match.matched_at, is_new: isNew,
  };
}
function replay(record: any, fingerprint: string) {
  if (record.get('fingerprint') !== fingerprint) throw datingError('request_id đã được dùng cho thao tác khác.', 409);
  return { ...record.get('response'), replayed: true };
}
export async function recordSwipe(userId: string, targetId: unknown, action: 'like' | 'superlike' | 'pass', suppliedRequestId?: unknown) {
  if (typeof targetId !== 'string' || !targetId.trim() || targetId.length > 100 || targetId === userId) {
    throw datingError('Hồ sơ được chọn không hợp lệ.');
  }
  const requestId = suppliedRequestId ?? randomUUID();
  if (typeof requestId !== 'string' || !/^[a-zA-Z0-9_.:-]{1,100}$/.test(requestId)) throw datingError('request_id không hợp lệ.');
  const fingerprint = createHash('sha256').update(JSON.stringify({ targetId, action })).digest('hex');
  const requestWhere = { user_id: userId, request_id: requestId };
  try {
    return await datingTransaction(async transaction => {
      const pair = await lockPair(userId, targetId, transaction);
      const prior = await DatingRequest.findOne({ where: requestWhere, transaction });
      if (prior) return replay(prior, fingerprint);
      if (pair.get('state') === 'unmatched') throw datingError('Cặp này đã hủy kết đôi và không thể tự kết đôi lại.', 409);
      const blocked = await UserBlock.findOne({
        where: { [Op.or]: [{ user_id: userId, target_id: targetId }, { user_id: targetId, target_id: userId }] }, transaction,
      });
      if (blocked || pair.get('state') === 'blocked') throw datingError('Không thể tương tác với hồ sơ này.', 403);
      const users = await User.findAll({ where: { id: { [Op.in]: [userId, targetId] } }, include: profileIncludes(), transaction });
      const sender = users.find(user => user.get('id') === userId), target = users.find(user => user.get('id') === targetId);
      if (!sender || !target || sender.get('status') !== 'ACTIVE' || target.get('status') !== 'ACTIVE' || target.get('role') !== 'USER') {
        throw datingError('Hồ sơ không còn khả dụng.', 404);
      }
      const senderProfile = sender.toJSON() as DatingProfile, targetProfile = target.toJSON() as DatingProfile;
      const pairWhere = { [Op.or]: [{ user1_id: userId, user2_id: targetId }, { user1_id: targetId, user2_id: userId }] };
      const existing: any = await Match.findOne({ where: pairWhere, transaction });
      const details = compatibility(senderProfile, targetProfile);
      let result: any;
      if (existing) {
        result = { matched: true, match: formatMatch(existing, userId, targetProfile, details.score) };
      } else {
        if (action !== 'pass' && !mutuallyEligible(senderProfile, targetProfile)) {
          throw datingError('Hồ sơ không còn đáp ứng điều kiện hẹn hò hai chiều. Kiểm tra bộ lọc và vị trí của bạn.');
        }
        const previous = await UserSwipe.findOne({ where: { user_id: userId, target_id: targetId }, transaction });
        const previousAction = previous?.get('action');
        await UserSwipe.upsert({
          user_id: userId, target_id: targetId, action, updated_at: new Date(),
          expires_at: action === 'pass' ? new Date(Date.now() + PASS_COOLDOWN_DAYS * 86400000) : null,
        }, { transaction });
        if (previousAction !== action) await DatingEvent.create({
          user_id: userId, target_id: targetId, type: action,
          algorithm_version: ALGORITHM_VERSION, features: details,
        }, { transaction });
        const reciprocal = action === 'pass' ? null : await UserSwipe.findOne({
          where: { user_id: targetId, target_id: userId, action: { [Op.in]: ['like', 'superlike'] } }, transaction,
        });
        result = { matched: false };
        if (reciprocal) {
          // The unique pair row is held until commit for every relationship mutation.
          const match: any = await Match.create({
            user1_id: pair.get('user_low_id'), user2_id: pair.get('user_high_id'), match_percentage: details.score,
            pair_key: pair.get('user_low_id') + ':' + pair.get('user_high_id'),
          }, { transaction });
          await pair.update({ state: 'matched' }, { transaction });
          await Conversation.create({ match_id: match.id }, { transaction });
          await Notification.bulkCreate([
            { user_id: userId, from_user_id: targetId, type: 'match', message: 'Hai bạn đã thích nhau! Hãy bắt đầu trò chuyện.', is_read: false },
            { user_id: targetId, from_user_id: userId, type: 'match', message: 'Hai bạn đã thích nhau! Hãy bắt đầu trò chuyện.', is_read: false },
          ], { transaction });
          await DatingEvent.create({ user_id: userId, target_id: targetId, type: 'match', algorithm_version: ALGORITHM_VERSION, features: details }, { transaction });
          result = { matched: true, match: formatMatch(match, userId, targetProfile, details.score, true) };
        } else if (action !== 'pass' && previousAction !== action) {
          await Notification.create({
            user_id: targetId, from_user_id: userId, type: action === 'superlike' ? 'super_like' : 'like',
            message: action === 'superlike' ? 'Bạn vừa nhận được một Super Like!' : 'Có người vừa thích bạn!', is_read: false,
          }, { transaction });
        }
      }
      await DatingRequest.create({ ...requestWhere, fingerprint, response: result }, { transaction });
      return result;
    });
  } catch (error) {
    // The same request key can race on two different pair locks. The losing transaction rolls back.
    if (error instanceof UniqueConstraintError) {
      const prior = await DatingRequest.findOne({ where: requestWhere });
      if (prior) return replay(prior, fingerprint);
    }
    throw error;
  }
}
