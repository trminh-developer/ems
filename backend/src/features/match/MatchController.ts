import { Request, Response } from 'express';
import { Match, User, UserInterest } from '../../models';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { Op } from 'sequelize';

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // IDOR Check
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'User1' },
        { model: User, as: 'User2' }
      ]
    });
    
    // Map matches to frontend format
    const formattedMatches = matches.map((m: any) => {
      const match = m.toJSON();
      const isUser1 = match.user1_id === userId;
      const matchedUser = isUser1 ? match.User2 : match.User1;
      return {
        id: match.id,
        user_id: userId,
        matched_user_id: matchedUser?.id || (isUser1 ? match.user2_id : match.user1_id),
        matched_user: matchedUser || null,
        match_percentage: match.match_percentage,
        matched_at: match.matched_at,
        is_new: false
      };
    });
    return res.json(formattedMatches);
  } catch (e: any) { 
    console.error('Error in getMatches:', e);
    return res.status(500).json({ error: 'Internal server error' }); 
  }
};

export const likeUser = async (req: AuthRequest, res: Response) => {
  try {
    const { targetId } = req.body;
    // IDOR Fix: Force userId to be the authenticated user
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { Match, User, Conversation, Notification } = require('../../models');
    
    // Check if match already exists
    const existingMatch = await Match.findOne({
      where: {
        [Op.or]: [
          { user1_id: userId, user2_id: targetId },
          { user1_id: targetId, user2_id: userId }
        ]
      }
    });

    if (existingMatch) {
      // If match already exists, it means they clicked again or it's a mutual like.
      const sender = await User.findByPk(userId);
      const targetUser = await User.findByPk(targetId);
      await Notification.create({
        user_id: targetId,
        type: 'like',
        message: `${sender?.first_name || 'Ai đó'} cũng đã thả tim lại bạn! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
      const formattedMatch = {
        id: existingMatch.id,
        user_id: userId,
        matched_user_id: targetId,
        matched_user: targetUser,
        match_percentage: existingMatch.match_percentage,
        matched_at: existingMatch.matched_at,
        is_new: false
      };
      return res.json({ matched: true, match: formattedMatch });
    }

    const match = await Match.create({
      user1_id: userId,
      user2_id: targetId,
      match_percentage: Math.floor(Math.random() * 40) + 60, // 60-99%
    });
    
    await Conversation.create({ match_id: match.id });

    // Create Notification for the target user (HEART)
    const sender = await User.findByPk(userId);
    const targetUser = await User.findByPk(targetId);

    if (targetUser) {
      await Notification.create({
        user_id: targetId,
        type: 'like',
        message: `${sender?.first_name || 'Ai đó'} đã thả tim (Heart) cho bạn! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
    }

    // Create Notification for the liker (userId)
    await Notification.create({
      user_id: userId,
      type: 'match',
      message: `Bạn đã thả tim và tương hợp với ${targetUser?.first_name || 'đối phương'}!`,
      is_read: false,
      from_user_id: targetId
    });

    const formattedMatch = {
      id: match.id,
      user_id: userId,
      matched_user_id: targetId,
      matched_user: targetUser,
      match_percentage: match.match_percentage,
      matched_at: match.matched_at,
      is_new: true
    };

    return res.json({ matched: true, match: formattedMatch });
  } catch (e: any) { 
    console.error('Error in likeUser:', e);
    return res.status(500).json({ error: 'Internal server error' }); 
  }
};

export const passUser = async (req: Request, res: Response) => {
  return res.json({ success: true });
};

export const superlikeUser = async (req: AuthRequest, res: Response) => {
  try {
    const { targetId } = req.body;
    // IDOR Fix: Force userId to be the authenticated user
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { Match, User, Conversation, Notification } = require('../../models');
    
    // Check if match already exists
    const existingMatch = await Match.findOne({
      where: {
        [Op.or]: [
          { user1_id: userId, user2_id: targetId },
          { user1_id: targetId, user2_id: userId }
        ]
      }
    });

    if (existingMatch) {
      const sender = await User.findByPk(userId);
      const targetUser = await User.findByPk(targetId);
      await Notification.create({
        user_id: targetId,
        type: 'super_like',
        message: `${sender?.first_name || 'Ai đó'} cũng đã thả Sao Tâm Giao (Super Like) cho bạn! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
      const formattedMatch = {
        id: existingMatch.id,
        user_id: userId,
        matched_user_id: targetId,
        matched_user: targetUser,
        match_percentage: existingMatch.match_percentage,
        matched_at: existingMatch.matched_at,
        is_new: false
      };
      return res.json({ matched: true, match: formattedMatch });
    }

    const match = await Match.create({
      user1_id: userId,
      user2_id: targetId,
      match_percentage: Math.floor(Math.random() * 20) + 80, // Super likes give higher match %
    });
    
    await Conversation.create({ match_id: match.id });

    // Create Notification for the target user (STAR)
    const sender = await User.findByPk(userId);
    const targetUser = await User.findByPk(targetId);

    if (targetUser) {
      await Notification.create({
        user_id: targetId,
        type: 'super_like', // Use super_like for star
        message: `${sender?.first_name || 'Ai đó'} đã gửi tặng bạn 1 Super Like (Ngôi sao)! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
    }

    // Create Notification for the liker (userId)
    await Notification.create({
      user_id: userId,
      type: 'match',
      message: `Super Like thành công! Bạn đã tương hợp với ${targetUser?.first_name || 'đối phương'}.`,
      is_read: false
    });

    const formattedMatch = {
      id: match.id,
      user_id: userId,
      matched_user_id: targetId,
      matched_user: targetUser,
      match_percentage: match.match_percentage,
      matched_at: match.matched_at,
      is_new: true
    };
    
    return res.json({ matched: true, match: formattedMatch });
  } catch (e: any) { 
    console.error('Error in superlikeUser:', e);
    return res.status(500).json({ error: 'Internal server error' }); 
  }
};

export const unmatch = async (req: AuthRequest, res: Response) => {
  try {
    const { Match } = require('../../models');
    const matchId = req.params.id;
    const match = await Match.findByPk(matchId);
    
    if (!match) return res.status(404).json({ error: 'Match not found' });
    
    // IDOR Check
    if (req.user?.role !== 'ADMIN' && match.user1_id !== req.user?.id && match.user2_id !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await match.destroy();
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};

export const getWhoLikedMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId; 
    // IDOR Check
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { Match, User } = require('../../models');
    const matches = await Match.findAll({
      where: { user2_id: userId },
      include: [{ model: User, as: 'User1' }]
    });
    return res.json(matches.map((m: any) => m.User1).filter(Boolean));
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};

export const getWhoILiked = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    // IDOR Check
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { Match, User } = require('../../models');
    const matches = await Match.findAll({
      where: { user1_id: userId },
      include: [{ model: User, as: 'User2' }]
    });
    return res.json(matches.map((m: any) => m.User2).filter(Boolean));
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};
