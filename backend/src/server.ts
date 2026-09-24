import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { initPaymentModule } from './features/payment/di/PaymentModule';
import { initAuthModule } from './features/auth/AuthModule';
import userModule from './features/user/UserModule';
import matchModule from './features/match/MatchModule';
import messageModule from './features/message/MessageModule';
import feedModule from './features/feed/FeedModule';
import notificationModule from './features/notification/NotificationModule';
import adminModule from './features/admin/AdminModule';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Configurations
app.set('trust proxy', 1); // Trust first proxy to allow secure cookies over HTTPS (Checklist #13, #15)
app.disable('x-powered-by'); // Hide Express signature

// Security Middlewares
app.use(helmet()); // Adds security headers (Checklist #14)

const allowedOrigins = [
  'http://localhost:5173',
  'https://heartconnect-8e934.web.app',
  'https://heartconnect-8e934.firebaseapp.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies to be sent (Checklist #15)
}));

app.use(cookieParser());

// Limit payload size to prevent DoS (Checklist #7, #8)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Rate Limiter for Authentication (Checklist #2)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.get('/', (req, res) => {
  res.send('Dating App Backend is running!');
});

const paymentRoutes = initPaymentModule();
app.use('/api/payments', paymentRoutes);

const authRoutes = initAuthModule();
app.use('/api/auth', authLimiter, authRoutes); // Apply rate limiter to auth

app.use(userModule);
app.use(matchModule);
app.use(messageModule);
app.use(feedModule);
app.use(notificationModule);
app.use(adminModule);

import sequelize from './config/db';

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'OK', message: 'HeartConnect API is running', version: '1.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    // Vẫn bật server kể cả khi DB lỗi để lấy log 
    app.listen(PORT, () => {
      console.log(`Backend server is running (DB Error) on http://localhost:${PORT}`);
    });
  });
