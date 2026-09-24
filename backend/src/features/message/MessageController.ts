import { Request, Response } from 'express';
import { Message, Conversation } from '../../models';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { Op } from 'sequelize';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // IDOR Check
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { Conversation, Match, User, Message } = require('../../models');
    
    const conversations = await Conversation.findAll({
      include: [
        {
          model: Match,
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
        },
          {
            model: Message,
            order: [['created_at', 'DESC']]
          }
      ]
    });
    
    const formatted = conversations.map((c: any) => {
      const conv = c.toJSON();
      const match = conv.Match;
      const participants = [];
      if (match.User1) participants.push(match.User1);
      if (match.User2) participants.push(match.User2);
      
      return {
        id: conv.id,
        participants: participants,
        lastMessage: conv.Messages && conv.Messages.length > 0 ? conv.Messages[0] : null,
        unreadCount: 0,
        updatedAt: conv.updated_at
      };
    });
    
    return res.json(formatted);
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { Message, Conversation, Match } = require('../../models');
    const conversationId = req.params.conversationId;

    // Optional: check if the user is part of the conversation (IDOR prevention)
    const conv = await Conversation.findByPk(conversationId, {
      include: [{ model: Match }]
    });

    if (!conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (req.user?.role !== 'ADMIN' && conv.Match.user1_id !== req.user?.id && conv.Match.user2_id !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']]
    });
    return res.json(messages);
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, content, type } = req.body;
    // We enforce the senderId to be the authenticated user's ID
    const senderId = req.user?.id;

    if (!senderId) return res.status(401).json({ error: 'Unauthorized' });

    const { Message, Conversation, Notification, Match, User } = require('../../models');

    // IDOR Check: Ensure user is part of the conversation
    const conv = await Conversation.findByPk(conversationId, {
      include: [{ model: Match }]
    });

    if (!conv) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conv.Match.user1_id !== senderId && conv.Match.user2_id !== senderId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const msg = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      type: type || 'text'
    });
    
    await Conversation.update({ updated_at: new Date() }, { where: { id: conversationId } });

    if (conv && conv.Match) {
      const receiverId = conv.Match.user1_id === senderId ? conv.Match.user2_id : conv.Match.user1_id;
      const sender = await User.findByPk(senderId);

      await Notification.create({
        user_id: receiverId,
        from_user_id: senderId,
        type: 'message',
        message: `${sender.first_name} đã gửi cho bạn một tin nhắn mới.`,
        is_read: false
      });
    }

    return res.json(msg);
  } catch (e: any) { return res.status(500).json({ error: 'Internal server error' }); }
};

export const markAsRead = async (req: Request, res: Response) => { return res.json({ success: true }); };
export const deleteMessage = async (req: Request, res: Response) => { return res.json({ success: true }); };
