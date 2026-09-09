import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Match, UserInterest } from '../../models';

export const getMatches = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }]
      }
    });
    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const likeUser = async (req: Request, res: Response) => {
  try {
    const { userId, targetId } = req.body;
    
    // Check if the target already liked the user (simulated via UserInterest per instructions)
    const existingLike = await UserInterest.findOne({
      where: { user_id: targetId, interest_id: userId }
    });

    if (existingLike) {
      const match = await Match.create({
        user1_id: userId,
        user2_id: targetId,
        match_percentage: 100, // example value
      });
      return res.status(201).json({ message: "It's a match!", match });
    } else {
      const like = await UserInterest.create({
        user_id: userId,
        interest_id: targetId
      });
      return res.status(201).json({ message: 'User liked', like });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const unmatch = async (req: Request, res: Response) => {
  try {
    const match = await Match.findByPk(req.params.id as string);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    await match.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
