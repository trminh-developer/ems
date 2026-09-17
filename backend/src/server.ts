import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPaymentModule } from './features/payment/di/PaymentModule';
import { initAuthModule } from './features/auth/AuthModule';
import userModule from './features/user/UserModule';
import matchModule from './features/match/MatchModule';
import messageModule from './features/message/MessageModule';
import feedModule from './features/feed/FeedModule';
import notificationModule from './features/notification/NotificationModule';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Dating App Payment Backend is running!');
});

const paymentRoutes = initPaymentModule();
app.use('/api/payments', paymentRoutes);

const authRoutes = initAuthModule();
app.use('/api/auth', authRoutes);

app.use(userModule);
app.use(matchModule);
app.use(messageModule);
app.use(feedModule);
app.use(notificationModule);

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
