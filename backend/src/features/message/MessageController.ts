import { Request, Response } from "express";
import { Message, Conversation } from "../../models";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { Op } from "sequelize";

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // IDOR Check
    if (req.user?.id !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { Conversation, Match, User, Message } = require("../../models");

    const conversations = await Conversation.findAll({
      include: [
        {
          model: Match,
          where: {
            [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
          },
          include: [
            { model: User, as: "User1" },
            { model: User, as: "User2" },
          ],
        },
        {
          model: Message,
          order: [["created_at", "DESC"]],
        },
      ],
    });

    const formatted = conversations.map((c: any) => {
      const conv = c.toJSON();
      const match = conv.Match;
      const participants = [];
      if (match.User1) participants.push(match.User1);
      if (match.User2) participants.push(match.User2);
      // Find latest message not deleted for this user
      let lastMessage = null;
      if (conv.Messages && conv.Messages.length > 0) {
        const sortedMsgs = [...conv.Messages].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        for (const m of sortedMsgs) {
          let delFor = m.deleted_for;
          if (typeof delFor === "string") {
            try {
              delFor = JSON.parse(delFor);
            } catch {
              delFor = [];
            }
          }
          if (!Array.isArray(delFor) || !delFor.includes(userId)) {
            lastMessage = m;
            break;
          }
        }
      }

      return {
        id: conv.id,
        participants: participants,
        lastMessage: lastMessage,
        unreadCount: 0,
        updatedAt: conv.updated_at,
      };
    });

    return res.json(formatted);
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { Message, Conversation, Match } = require("../../models");
    const conversationId = req.params.conversationId;

    // IDOR prevention: check if user is in conversation
    const conv = await Conversation.findByPk(conversationId, {
      include: [{ model: Match }],
    });

    if (!conv) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (
      req.user?.role !== "ADMIN" &&
      conv.Match?.user1_id !== req.user?.id &&
      conv.Match?.user2_id !== req.user?.id
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [["created_at", "ASC"]],
    });

    const currentUserId = req.user?.id;
    const filteredMessages = messages.filter((m: any) => {
      let delFor = m.deleted_for;
      if (typeof delFor === "string") {
        try {
          delFor = JSON.parse(delFor);
        } catch {
          delFor = [];
        }
      }
      if (Array.isArray(delFor) && delFor.includes(currentUserId)) {
        return false;
      }
      return true;
    });

    return res.json(filteredMessages);
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, content, type } = req.body;
    // We enforce the senderId to be the authenticated user's ID
    const senderId = req.user?.id;

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });

    const {
      Message,
      Conversation,
      Notification,
      Match,
      User,
    } = require("../../models");

    // IDOR Check: Ensure user is part of the conversation
    const conv = await Conversation.findByPk(conversationId, {
      include: [{ model: Match }],
    });

    if (!conv) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (
      conv.Match?.user1_id !== senderId &&
      conv.Match?.user2_id !== senderId
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const msg = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      type: type || "text",
    });

    await Conversation.update(
      { updated_at: new Date() },
      { where: { id: conversationId } },
    );

    if (conv && conv.Match) {
      const receiverId =
        conv.Match.user1_id === senderId
          ? conv.Match.user2_id
          : conv.Match.user1_id;
      const sender = await User.findByPk(senderId);

      await Notification.create({
        user_id: receiverId,
        from_user_id: senderId,
        type: "message",
        message: `${sender?.first_name || "Người dùng"} đã gửi cho bạn một tin nhắn mới.`,
        is_read: false,
      });
    }

    return res.json(msg);
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  return res.json({ success: true });
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { Message } = require("../../models");
    const msg = await Message.findByPk(messageId);
    if (!msg) {
      return res.status(404).json({ error: "Message not found" });
    }

    let delFor = msg.deleted_for;
    if (typeof delFor === "string") {
      try {
        delFor = JSON.parse(delFor);
      } catch {
        delFor = [];
      }
    }
    if (!Array.isArray(delFor)) {
      delFor = [];
    }

    if (!delFor.includes(userId)) {
      delFor.push(userId);
      await msg.update({ deleted_for: delFor });
    }

    return res.json({ success: true, messageId });
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const recallMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { Message } = require("../../models");
    const msg = await Message.findByPk(messageId);
    if (!msg) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only the sender (or admin) can recall
    if (msg.sender_id !== userId && req.user?.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only recall your own messages" });
    }

    await msg.update({
      is_recalled: true,
      content: "Tin nhắn đã được thu hồi",
    });

    return res.json({ success: true, message: msg });
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
