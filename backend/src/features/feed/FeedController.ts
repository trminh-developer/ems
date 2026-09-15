import { Request, Response } from 'express';
import { Status, StatusLike, StatusComment, User } from '../../models';

export const getStatuses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let whereClause = {};
    if (userId && userId !== 'all') {
      whereClause = { user_id: userId };
    }

    const statuses = await Status.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['id', 'username', 'first_name', 'last_name', 'avatar'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // We also need likesCount and commentsCount, we can fetch them manually or dynamically
    const results = await Promise.all(statuses.map(async (s: any) => {
      const likesCount = await StatusLike.count({ where: { status_id: s.id } });
      const commentsCount = await StatusComment.count({ where: { status_id: s.id } });
      let hasLiked = false;
      // In a real app we pass current user id, but we don't have it in req.params for /all
      // Just returning false for now, frontend might need adjustment or we ignore hasLiked
      
      return {
        id: s.id,
        userId: s.user_id,
        user: s.User ? {
          id: s.User.id,
          username: s.User.username,
          firstName: s.User.first_name,
          lastName: s.User.last_name,
          avatar: s.User.avatar
        } : undefined,
        content: s.content,
        mediaUrls: s.media_urls || [],
        createdAt: s.created_at,
        likesCount,
        commentsCount,
        hasLiked
      };
    }));

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch statuses' });
  }
};

export const createStatus = async (req: Request, res: Response) => {
  try {
    const { userId, content, mediaUrls } = req.body;
    const status = await Status.create({
      user_id: userId,
      content,
      media_urls: mediaUrls || []
    });
    return res.json({ success: true, status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create status' });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { statusId, userId, isLiked } = req.body;
    if (isLiked) {
      await StatusLike.create({ status_id: statusId, user_id: userId });
    } else {
      await StatusLike.destroy({ where: { status_id: statusId, user_id: userId } });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { statusId } = req.params;
    const comments = await StatusComment.findAll({
      where: { status_id: statusId },
      include: [
        { model: User, attributes: ['id', 'username', 'first_name', 'last_name', 'avatar'] }
      ],
      order: [['created_at', 'ASC']]
    });

    const results = comments.map((c: any) => ({
      id: c.id,
      statusId: c.status_id,
      userId: c.user_id,
      content: c.content,
      createdAt: c.created_at,
      user: c.User ? {
        id: c.User.id,
        username: c.User.username,
        firstName: c.User.first_name,
        lastName: c.User.last_name,
        avatar: c.User.avatar
      } : undefined
    }));

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { statusId, userId, content } = req.body;
    const comment = await StatusComment.create({
      status_id: statusId,
      user_id: userId,
      content
    });
    return res.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const deleteStatus = async (req: Request, res: Response) => {
  try {
    const { statusId } = req.params;
    await StatusLike.destroy({ where: { status_id: statusId } });
    await StatusComment.destroy({ where: { status_id: statusId } });
    await Status.destroy({ where: { id: statusId } });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete status' });
  }
};
