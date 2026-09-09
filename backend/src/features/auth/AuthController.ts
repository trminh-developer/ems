import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-key';

// Simulated in-memory store for refresh tokens (Single-Use in Ram)
const refreshTokens = new Map<string, string>();

export class AuthController {
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    // Authenticate user with MySQL Sequelize
    const user = await User.findOne({ where: { email } });
    
    if (!user || (user as any).password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const data = user.toJSON();
    const userId = data.id;

    // Issue tokens
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
    
    // Store refresh token
    refreshTokens.set(refreshToken, userId);
    
    res.json({ accessToken, refreshToken, user: data });
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, password, username, first_name, last_name, gender, date_of_birth, relationship_goal, ...rest } = req.body;
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newUser = await User.create({
        email, password, username, first_name, last_name, gender, date_of_birth, relationship_goal, ...rest
      });

      const data = newUser.toJSON();
      const userId = data.id;

      const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
      refreshTokens.set(refreshToken, userId);

      res.status(201).json({ accessToken, refreshToken, user: data });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error creating user' });
    }
  }

  public async refresh(req: Request, res: Response) {
    const { token } = req.body;
    
    // 1. Check if token exists in store (Validates rotation)
    if (!token || !refreshTokens.has(token)) {
      return res.status(401).json({ error: 'Refresh token invalid or expired' });
    }

    try {
      // 2. Verify token signature
      const decoded = jwt.verify(token, REFRESH_SECRET) as any;
      
      // 3. SINGLE-USE TOKEN ROTATION (Pấp token mới thì hủy token c��)
      refreshTokens.delete(token);

      // 4. Issue new tokens
      const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, { expiresIn: '7d' });
      
      refreshTokens.set(newRefreshToken, decoded.id);
      
      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      // If verification fails, destroy the token anyway
      refreshTokens.delete(token);
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }

  public async logout(req: Request, res: Response) {
    const { token } = req.body;
    
    // HUY TOKEN TREN SERVER (Logout = hủy token client + server)
    if (token) {
      refreshTokens.delete(token);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  }
}
