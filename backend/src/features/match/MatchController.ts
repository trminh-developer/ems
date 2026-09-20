import { Request, Response } from 'express';
import { Match, User, UserInterest } from '../../models';

import { Op } from 'sequelize';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
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
        matched_user_id: matchedUser.id,
        matched_user: matchedUser,
        match_percentage: match.match_percentage,
        matched_at: match.matched_at,
        is_new: false
      };
    });
    return res.json(formattedMatches);
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const likeUser = async (req: Request, res: Response) => {
  try {
    const { userId, targetId } = req.body;
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
      // Create a notification for the other user just in case.
      const sender = await User.findByPk(userId);
      await Notification.create({
        user_id: targetId,
        type: 'like',
        message: `${sender?.first_name || 'Ai đó'} cũng đã thả tim lại bạn! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
      return res.json({ matched: true, match: existingMatch });
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

    await Notification.create({
      user_id: targetId,
      type: 'like',
      message: `${sender.first_name} đã thả tim (Heart) cho bạn! Hai bạn đã tương hợp.`,
      is_read: false,
      from_user_id: userId
    });

    // Create Notification for the liker (userId)
    await Notification.create({
      user_id: userId,
      type: 'match',
      message: `Bạn đã thả tim và tương hợp với ${targetUser.first_name}!`,
      is_read: false,
      from_user_id: targetId
    });

    const matchedUser = targetUser;
    
    const formattedMatch = {
      id: match.id,
      user_id: userId,
      matched_user_id: targetId,
      matched_user: matchedUser,
      match_percentage: match.match_percentage,
      matched_at: match.matched_at,
      is_new: true
    };

    return res.json({ matched: true, match: formattedMatch });
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const passUser = async (req: Request, res: Response) => {
  return res.json({ success: true });
};

export const superlikeUser = async (req: Request, res: Response) => {
  try {
    const { userId, targetId } = req.body;
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
      await Notification.create({
        user_id: targetId,
        type: 'super_like',
        message: `${sender?.first_name || 'Ai đó'} cũng đã thả Sao Tâm Giao (Super Like) cho bạn! Hai bạn đã tương hợp.`,
        is_read: false,
        from_user_id: userId
      });
      return res.json({ matched: true, match: existingMatch });
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

    await Notification.create({
      user_id: targetId,
      type: 'super_like', // Use super_like for star
      message: `${sender.first_name} đã gửi tặng bạn 1 Super Like (Ngôi sao)! Hai bạn đã tương hợp.`,
      is_read: false,
      from_user_id: userId
    });

    // Create Notification for the liker (userId)
    await Notification.create({
      user_id: userId,
      type: 'match',
      message: `Super Like thành công! Bạn đã tương hợp với ${targetUser.first_name}.`,
      is_read: false
    });

    const matchedUser = targetUser;
    
    const formattedMatch = {
      id: match.id,
      user_id: userId,
      matched_user_id: targetId,
      matched_user: matchedUser,
      match_percentage: match.match_percentage,
      matched_at: match.matched_at,
      is_new: true
    };
    
    return res.json({ matched: true, match: formattedMatch });
  } catch (e: any) { 
    return res.status(500).json({ error: e.message }); 
  }
};

export const unmatch = async (req: Request, res: Response) => {
  try {
    const { Match } = require('../../models');
    await Match.destroy({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const getWhoLikedMe = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // Defaulting for now if auth middleware is missing
    const { Match, User } = require('../../models');
    const { Op } = require('sequelize');
    const matches = await Match.findAll({
      where: { user2_id: userId },
      include: [{ model: User, as: 'User1' }]
    });
    return res.json(matches.map((m: any) => m.User1).filter(Boolean));
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const getWhoILiked = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { Match, User } = require('../../models');
    const { Op } = require('sequelize');
    const matches = await Match.findAll({
      where: { user1_id: userId },
      include: [{ model: User, as: 'User2' }]
    });
    return res.json(matches.map((m: any) => m.User2).filter(Boolean));
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

