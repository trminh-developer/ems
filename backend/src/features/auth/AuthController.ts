import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../models';
import { z } from 'zod';
import { registerSchema } from '../../validators/userValidator';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-key';

// Simulated in-memory store for refresh tokens
const refreshTokens = new Map<string, string>();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // Requires HTTPS (or proxy)
  sameSite: 'none' as const, // Enables Cross-Origin cookies
  maxAge: 15 * 60 * 1000 // 15m
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
};

export class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password using bcrypt
      const isMatch = await bcrypt.compare(password, (user as any).password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const data = user.toJSON();
      const userId = data.id;

      // Issue tokens
      const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
      
      refreshTokens.set(refreshToken, userId);
      
      // Set tokens in HttpOnly cookies
      res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
      
      // Also return access token in JSON (fallback for current frontend)
      return res.json({ accessToken, refreshToken, user: data });
    } catch (e: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      // Zod validation (Checklist #9)
      const { email, password, firstName, lastName, gender, dateOfBirth } = registerSchema.parse(req.body);
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      let { username } = req.body;
      if (!username) {
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6);
        username = `${baseUsername}_${randomStr}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        first_name: firstName,
        last_name: lastName,
        gender,
        date_of_birth: dateOfBirth
      });

      const data = newUser.toJSON();
      const userId = data.id;

      const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
      refreshTokens.set(refreshToken, userId);

      res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      return res.status(201).json({ accessToken, refreshToken, user: data });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors[0].message });
      }
      return res.status(400).json({ error: 'Error creating user' });
    }
  }

  public async refresh(req: Request, res: Response) {
    // Try to get token from body OR cookies
    const token = req.body.token || req.cookies?.refreshToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Refresh token invalid or expired' });
    }

    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as any;
      
      refreshTokens.delete(token);

      const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, { expiresIn: '7d' });
      
      refreshTokens.set(newRefreshToken, decoded.id);
      
      res.cookie('accessToken', newAccessToken, COOKIE_OPTIONS);
      res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

      return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      refreshTokens.delete(token);
      res.clearCookie('accessToken', COOKIE_OPTIONS);
      res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  }

  public async forgotPassword(req: any, res: any) { res.json({ success: true }); } 
  public async verifyOTP(req: any, res: any) { res.json({ success: true }); } 
  public async resetPassword(req: any, res: any) { res.json({ success: true }); } 
  
  public async logout(req: Request, res: Response) {
    const token = req.body.token || req.cookies?.refreshToken;
    
    if (token) {
      refreshTokens.delete(token);
    }
    
    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

    return res.json({ success: true, message: 'Logged out successfully' });
  }

  public async me(req: Request, res: Response) {
    try {
      // Get token from auth header or cookies
      let token = req.cookies?.accessToken;
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) return res.status(401).json({ error: 'No token' });
      
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      return res.json(user.toJSON());
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}
