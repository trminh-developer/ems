import { Request, Response } from 'express';
import { User } from '../../models';

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { Interest } = require('../../models');
    const user = await User.findOne({ 
      where: { username: req.params.username },
      include: [{ model: Interest, as: 'interests', through: { attributes: [] } }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { Interest } = require('../../models');
    const user = await User.findByPk(req.params.id as string, {
      include: [{ model: Interest, as: 'interests', through: { attributes: [] } }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNearbyUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findByPk(req.params.id as string);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Convert camelCase from frontend back to snake_case for database
    const updateData: any = {};
    const body = req.body;
    
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.coverPhoto !== undefined) updateData.cover_photo = body.coverPhoto;
    if (body.dateOfBirth !== undefined) updateData.date_of_birth = body.dateOfBirth;
    if (body.isVerified !== undefined) updateData.is_verified = body.isVerified;
    if (body.isOnline !== undefined) updateData.is_online = body.isOnline;
    if (body.password !== undefined) updateData.password = body.password;
    
    if (body.location?.city !== undefined) updateData.city = body.location.city;
    if (body.location?.country !== undefined) updateData.country = body.location.country;
    
    // Fields that match directly
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.profession !== undefined) updateData.profession = body.profession;
    if (body.education !== undefined) updateData.education = body.education;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.relationshipGoal !== undefined) updateData.relationship_goal = body.relationshipGoal;
    
    if (body.photos !== undefined) {
      if (typeof body.photos === 'string') {
        try {
          updateData.photos = JSON.parse(body.photos);
        } catch {
          updateData.photos = [body.photos];
        }
      } else {
        updateData.photos = body.photos;
      }
    }

    await user.update(updateData);

    // Handle interests if provided
    if (body.interests && Array.isArray(body.interests)) {
      const UserInterest = require('../../models').UserInterest;
      // Remove old interests
      await UserInterest.destroy({ where: { user_id: user.id } });
      // Add new interests - filter out non-UUIDs (like newly created ones on frontend with Date.now())
      const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const interestRecords = body.interests
        .filter((interest: any) => validUuidRegex.test(interest.id))
        .map((interest: any) => ({
          user_id: user.id,
          interest_id: interest.id
        }));
      if (interestRecords.length > 0) {
        await UserInterest.bulkCreate(interestRecords);
      }
    }

    return res.json(user);
  } catch (e) {
    console.error('Update profile error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
