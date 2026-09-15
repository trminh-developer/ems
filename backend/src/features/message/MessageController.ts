import { Request, Response } from 'express';
import { Message, Conversation } from '../../models';

import { Op } from 'sequelize';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
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
          limit: 1,
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
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { Message } = require('../../models');
    const messages = await Message.findAll({
      where: { conversation_id: req.params.conversationId },
      order: [['created_at', 'ASC']]
    });
    return res.json(messages);
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, content, type } = req.body;
    const { Message, Conversation } = require('../../models');
    const msg = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      type: type || 'text'
    });
    await Conversation.update({ updated_at: new Date() }, { where: { id: conversationId } });
    return res.json(msg);
  } catch (e: any) { return res.status(500).json({ error: e.message }); }
};
export const markAsRead = async (req: Request, res: Response) => { return res.json({ success: true }); };
export const deleteMessage = async (req: Request, res: Response) => { return res.json({ success: true }); };
