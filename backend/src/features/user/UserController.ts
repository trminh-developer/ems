import { Request, Response } from 'express';
import { User } from '../../models';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ limit: 20 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update(req.body);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
