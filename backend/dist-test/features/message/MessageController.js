"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage =
  exports.markAsRead =
  exports.sendMessage =
  exports.getMessages =
  exports.getConversations =
    void 0;
const sequelize_1 = require("sequelize");
const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { Conversation, Match, User, Message } = require("../../models");
    const conversations = await Conversation.findAll({
      include: [
        {
          model: Match,
          where: {
            [sequelize_1.Op.or]: [{ user1_id: userId }, { user2_id: userId }],
          },
          include: [
            { model: User, as: "User1" },
            { model: User, as: "User2" },
          ],
        },
        {
          model: Message,
          // limit: 1, // Sequelize limitation: cannot use limit on hasMany inside include without separate: true, which is not supported well with everything. We'll sort in memory or omit limit.
          order: [["created_at", "DESC"]],
        },
      ],
    });
    const formatted = conversations.map((c) => {
      const conv = c.toJSON();
      const match = conv.Match;
      const participants = [];
      if (match.User1) participants.push(match.User1);
      if (match.User2) participants.push(match.User2);
      return {
        id: conv.id,
        participants: participants,
        lastMessage:
          conv.Messages && conv.Messages.length > 0 ? conv.Messages[0] : null,
        unreadCount: 0,
        updatedAt: conv.updated_at,
      };
    });
    return res.json(formatted);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
  try {
    const { Message } = require("../../models");
    const messages = await Message.findAll({
      where: { conversation_id: req.params.conversationId },
      order: [["created_at", "ASC"]],
    });
    return res.json(messages);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content, type } = req.body;
    const {
      Message,
      Conversation,
      Notification,
      Match,
      User,
    } = require("../../models");
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
    // Find the conversation to get the other user's ID
    const conv = await Conversation.findByPk(conversationId, {
      include: [{ model: Match }],
    });
    if (conv && conv.Match) {
      const receiverId =
        conv.Match.user1_id === senderId
          ? conv.Match.user2_id
          : conv.Match.user1_id;
      const sender = await User.findByPk(senderId);
      // Create a message notification for the receiver
      await Notification.create({
        user_id: receiverId,
        from_user_id: senderId,
        type: "message",
        message: `${sender.first_name} đã gửi cho bạn một tin nhắn mới.`,
        is_read: false,
      });
    }
    return res.json(msg);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.sendMessage = sendMessage;
const markAsRead = async (req, res) => {
  return res.json({ success: true });
};
exports.markAsRead = markAsRead;
const deleteMessage = async (req, res) => {
  return res.json({ success: true });
};
exports.deleteMessage = deleteMessage;
