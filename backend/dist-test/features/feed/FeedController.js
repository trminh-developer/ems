"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStatus =
  exports.addComment =
  exports.getComments =
  exports.toggleLike =
  exports.createStatus =
  exports.getStatuses =
    void 0;
const models_1 = require("../../models");
const getStatuses = async (req, res) => {
  try {
    const { userId } = req.params;
    let whereClause = {};
    if (userId && userId !== "all") {
      whereClause = { user_id: userId };
    }
    const statuses = await models_1.Status.findAll({
      where: whereClause,
      include: [
        {
          model: models_1.User,
          attributes: ["id", "username", "first_name", "last_name", "avatar"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    // We also need likesCount and commentsCount, we can fetch them manually or dynamically
    const results = await Promise.all(
      statuses.map(async (s) => {
        const likesCount = await models_1.StatusLike.count({
          where: { status_id: s.id },
        });
        const commentsCount = await models_1.StatusComment.count({
          where: { status_id: s.id },
        });
        let hasLiked = false;
        // In a real app we pass current user id, but we don't have it in req.params for /all
        // Just returning false for now, frontend might need adjustment or we ignore hasLiked
        return {
          id: s.id,
          userId: s.user_id,
          user: s.User
            ? {
                id: s.User.id,
                username: s.User.username,
                firstName: s.User.first_name,
                lastName: s.User.last_name,
                avatar: s.User.avatar,
              }
            : undefined,
          content: s.content,
          mediaUrls: s.media_urls || [],
          createdAt: s.created_at,
          likesCount,
          commentsCount,
          hasLiked,
        };
      }),
    );
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch statuses" });
  }
};
exports.getStatuses = getStatuses;
const createStatus = async (req, res) => {
  try {
    const { userId, content, mediaUrls } = req.body;
    const status = await models_1.Status.create({
      user_id: userId,
      content,
      media_urls: mediaUrls || [],
    });
    return res.json({ success: true, status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create status" });
  }
};
exports.createStatus = createStatus;
const toggleLike = async (req, res) => {
  try {
    const { statusId, userId, isLiked } = req.body;
    if (isLiked) {
      await models_1.StatusLike.create({
        status_id: statusId,
        user_id: userId,
      });
    } else {
      await models_1.StatusLike.destroy({
        where: { status_id: statusId, user_id: userId },
      });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
};
exports.toggleLike = toggleLike;
const getComments = async (req, res) => {
  try {
    const { statusId } = req.params;
    const comments = await models_1.StatusComment.findAll({
      where: { status_id: statusId },
      include: [
        {
          model: models_1.User,
          attributes: ["id", "username", "first_name", "last_name", "avatar"],
        },
      ],
      order: [["created_at", "ASC"]],
    });
    const results = comments.map((c) => ({
      id: c.id,
      statusId: c.status_id,
      userId: c.user_id,
      content: c.content,
      createdAt: c.created_at,
      user: c.User
        ? {
            id: c.User.id,
            username: c.User.username,
            firstName: c.User.first_name,
            lastName: c.User.last_name,
            avatar: c.User.avatar,
          }
        : undefined,
    }));
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
};
exports.getComments = getComments;
const addComment = async (req, res) => {
  try {
    const { statusId, userId, content } = req.body;
    const comment = await models_1.StatusComment.create({
      status_id: statusId,
      user_id: userId,
      content,
    });
    return res.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};
exports.addComment = addComment;
const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    await models_1.StatusLike.destroy({ where: { status_id: statusId } });
    await models_1.StatusComment.destroy({ where: { status_id: statusId } });
    await models_1.Status.destroy({ where: { id: statusId } });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete status" });
  }
};
exports.deleteStatus = deleteStatus;
