import { Request, Response } from 'express';
import { Status, StatusLike, StatusComment, User } from '../../models';
import { AuthRequest } from '../../middlewares/authMiddleware';

// Regex to check if base64 string is a valid image (jpeg, png, webp, gif)
const isBase64Image = (str: string) => {
  return /^data:image\/(jpeg|png|webp|gif);base64,/.test(str);
};

export const getStatuses = async (req: AuthRequest, res: Response) => {
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

    const results = await Promise.all(statuses.map(async (s: any) => {
      const likesCount = await StatusLike.count({ where: { status_id: s.id } });
      const commentsCount = await StatusComment.count({ where: { status_id: s.id } });
      
      let hasLiked = false;
      if (req.user) {
        const like = await StatusLike.findOne({ where: { status_id: s.id, user_id: req.user.id } });
        hasLiked = !!like;
      }
      
      return {
        id: s.id,
        userId: s.user_id,
        User: s.User,
        content: s.content,
        mediaUrls: s.media_urls,
        likesCount,
        commentsCount,
        hasLiked,
        createdAt: s.created_at
      };
    }));

    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { content, mediaUrls } = req.body;
    // ALWAYS use the authenticated user's ID
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Validate mediaUrls (Checklist #7: Giới hạn loại file)
    if (mediaUrls && Array.isArray(mediaUrls)) {
      for (const media of mediaUrls) {
        if (!isBase64Image(media)) {
          return res.status(400).json({ error: 'Invalid file type. Only image uploads are allowed.' });
        }
      }
    }

    const status = await Status.create({
      user_id: userId,
      content,
      media_urls: mediaUrls || []
    });
    return res.json({ success: true, status });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { statusId, isLiked } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (isLiked) {
      await StatusLike.create({ status_id: statusId, user_id: userId });
    } else {
      await StatusLike.destroy({ where: { status_id: statusId, user_id: userId } });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { statusId, content } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const comment = await StatusComment.create({
      status_id: statusId,
      user_id: userId,
      content
    });
    return res.json({ success: true, comment });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
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
    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { statusId } = req.params;
    const userId = req.user?.id;

    const status: any = await Status.findByPk(statusId as string);
    if (!status) return res.status(404).json({ error: 'Status not found' });

    // IDOR Check: Only the owner or admin can delete
    if (status.user_id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await status.destroy();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
