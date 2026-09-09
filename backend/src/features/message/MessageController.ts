import { Request, Response } from 'express';
import { Message, Conversation } from '../../models';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.findAll({
      where: { conversation_id: req.params.conversationId },
      order: [['created_at', 'ASC']]
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversation_id, sender_id, content } = req.body;
    const message = await Message.create({
      conversation_id,
      sender_id,
      content,
      type: 'text',
      status: 'sent'
    });
    
    // Update conversation's updated_at timestamp
    await Conversation.update(
      { updated_at: new Date() },
      { where: { id: conversation_id } }
    );
    
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
