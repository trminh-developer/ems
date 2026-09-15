import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-key';

// Simulated in-memory store for refresh tokens (Single-Use in Ram)
const refreshTokens = new Map<string, string>();

export class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', email, password);
      
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
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Internal server error' });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, gender, dateOfBirth } = req.body;
      console.log('Register attempt:', email);
      
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Generate a unique username if not provided
      let { username } = req.body;
      if (!username) {
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6);
        username = `${baseUsername}_${randomStr}`;
      }

      // In real app, hash password here
      const newUser = await User.create({
        email,
        password,
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

  public async forgotPassword(req: any, res: any) { res.json({ success: true }); } public async verifyOTP(req: any, res: any) { res.json({ success: true }); } public async resetPassword(req: any, res: any) { res.json({ success: true }); } public async logout(req: Request, res: Response) {
    const { token } = req.body;
    
    // HUY TOKEN TREN SERVER (Logout = hủy token client + server)
    if (token) {
      refreshTokens.delete(token);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  }

  public async me(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'No token' });
      const token = authHeader.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user.toJSON());
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}
