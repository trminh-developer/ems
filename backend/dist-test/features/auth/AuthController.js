"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../../models");
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-key';
// Simulated in-memory store for refresh tokens (Single-Use in Ram)
const refreshTokens = new Map();
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log('Login attempt:', email, password);
            // Authenticate user with MySQL Sequelize
            const user = await models_1.User.findOne({ where: { email } });
            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const data = user.toJSON();
            const userId = data.id;
            // Issue tokens
            const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
            // Store refresh token
            refreshTokens.set(refreshToken, userId);
            res.json({ accessToken, refreshToken, user: data });
        }
        catch (e) {
            res.status(500).json({ error: e.message || 'Internal server error' });
        }
    }
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, gender, dateOfBirth } = req.body;
            console.log('Register attempt:', email);
            // Check if user already exists
            const existingUser = await models_1.User.findOne({ where: { email } });
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
            const newUser = await models_1.User.create({
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
            const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
            refreshTokens.set(refreshToken, userId);
            res.status(201).json({ accessToken, refreshToken, user: data });
        }
        catch (error) {
            res.status(400).json({ error: error.message || 'Error creating user' });
        }
    }
    async refresh(req, res) {
        const { token } = req.body;
        // 1. Check if token exists in store (Validates rotation)
        if (!token || !refreshTokens.has(token)) {
            return res.status(401).json({ error: 'Refresh token invalid or expired' });
        }
        try {
            // 2. Verify token signature
            const decoded = jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
            // 3. SINGLE-USE TOKEN ROTATION (Pấp token mới thì hủy token c��)
            refreshTokens.delete(token);
            // 4. Issue new tokens
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });
            const newRefreshToken = jsonwebtoken_1.default.sign({ id: decoded.id }, REFRESH_SECRET, { expiresIn: '7d' });
            refreshTokens.set(newRefreshToken, decoded.id);
            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        }
        catch (err) {
            // If verification fails, destroy the token anyway
            refreshTokens.delete(token);
            res.status(403).json({ error: 'Invalid refresh token' });
        }
    }
    async forgotPassword(req, res) { res.json({ success: true }); }
    async verifyOTP(req, res) { res.json({ success: true }); }
    async resetPassword(req, res) { res.json({ success: true }); }
    async logout(req, res) {
        const { token } = req.body;
        // HUY TOKEN TREN SERVER (Logout = hủy token client + server)
        if (token) {
            refreshTokens.delete(token);
        }
        res.json({ success: true, message: 'Logged out successfully' });
    }
    async me(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader)
                return res.status(401).json({ error: 'No token' });
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await models_1.User.findByPk(decoded.id);
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            res.json(user.toJSON());
        }
        catch (e) {
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}
exports.AuthController = AuthController;
