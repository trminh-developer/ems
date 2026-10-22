import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { z } from 'zod';
import { updateProfileSchema } from '../../validators/userValidator';

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { Interest } = require('../../models');
    const user = await User.findOne({ 
      where: { username: req.params.username },
      include: [{ model: Interest, as: 'interests', through: { attributes: [] } }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error: any) {
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
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
  } catch (error: any) {
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (error: any) {
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getNearbyUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (error: any) {
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (error: any) {
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userIdToUpdate = req.params.id as string;
    
    // AUTHORIZATION CHECK (IDOR Protection)
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Users can only update their own profile (unless they are admin)
    if (req.user.id !== userIdToUpdate && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const user: any = await User.findByPk(userIdToUpdate);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const updateData: any = {};
    const body = updateProfileSchema.parse(req.body);
    
    // Whitelist only safe fields
    if (body.username !== undefined) updateData.username = body.username;
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.coverPhoto !== undefined) updateData.cover_photo = body.coverPhoto;
    if (body.dateOfBirth !== undefined) {
      updateData.date_of_birth = body.dateOfBirth === '' ? null : body.dateOfBirth;
    }
    if (body.isOnline !== undefined) updateData.is_online = body.isOnline;
    
    // Hash password if updated
    if (body.password && body.password.trim() !== '') {
      updateData.password = await bcrypt.hash(body.password, 10);
    }
    
    if (body.location?.city !== undefined) updateData.city = body.location.city;
    if (body.location?.country !== undefined) updateData.country = body.location.country;
    if (body.location?.latitude !== undefined) updateData.latitude = body.location.latitude;
    if (body.location?.longitude !== undefined) updateData.longitude = body.location.longitude;
    
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.profession !== undefined) updateData.profession = body.profession;
    if (body.education !== undefined) updateData.education = body.education;
    if (body.relationshipGoal !== undefined) updateData.relationship_goal = body.relationshipGoal;
    
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.photos !== undefined) updateData.photos = body.photos;
    
    if (body.interests && Array.isArray(body.interests)) {
      const { Interest } = require('../../models');
      const interestRecords = [];
      for (const i of body.interests) {
        if (i.name) {
          const [record] = await Interest.findOrCreate({
            where: { name: i.name },
            defaults: { icon: i.icon || 'bi-star', category: i.category || 'other' }
          });
          interestRecords.push(record);
        }
      }
      await user.setInterests(interestRecords);
    }

    // Update preferences if any
    if (body.datingPreference) {
      if (body.datingPreference.preferredGender !== undefined) updateData.preferred_gender = body.datingPreference.preferredGender;
      if (body.datingPreference.ageRange) {
        if (body.datingPreference.ageRange.min !== undefined) updateData.age_min = body.datingPreference.ageRange.min;
        if (body.datingPreference.ageRange.max !== undefined) updateData.age_max = body.datingPreference.ageRange.max;
      }
      if (body.datingPreference.maxDistance !== undefined) updateData.max_distance = body.datingPreference.maxDistance;
      if (body.datingPreference.relationshipGoal !== undefined) updateData.pref_relationship_goal = body.datingPreference.relationshipGoal;
    }

    await user.update(updateData);

    const { Interest } = require('../../models');
    await user.reload({
      include: [{ model: Interest, as: 'interests', through: { attributes: [] } }]
    });

    return res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('ZodError:', JSON.stringify(error.issues)); return res.status(400).json({ error: error.issues.map(e => e.path.join('.') + ': ' + e.message).join(', ') });
    }
    console.error(error); return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const blockUser = async (req: Request, res: Response) => { res.json({ success: true }); }
export const reportUser = async (req: Request, res: Response) => { res.json({ success: true }); }
