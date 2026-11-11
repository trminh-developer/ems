import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import axios from "axios";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import { initPaymentModule } from "./features/payment/di/PaymentModule";
import { initAuthModule } from "./features/auth/AuthModule";
import userModule from "./features/user/UserModule";
import matchModule from "./features/match/MatchModule";
import messageModule from "./features/message/MessageModule";
import feedModule from "./features/feed/FeedModule";
import notificationModule from "./features/notification/NotificationModule";
import adminModule from "./features/admin/AdminModule";
import { createCorsOptions } from './config/cors';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Sentry for Error Tracking (Checklist #20)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    // profilesSampleRate: 1.0,
  });
}

// Security Configurations
app.set("trust proxy", 1); // Trust first proxy to allow secure cookies over HTTPS (Checklist #13, #15)
app.disable("x-powered-by"); // Hide Express signature

import compression from "compression";

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
); // Adds security headers while allowing cross-origin API calls
app.use(compression()); // Compress responses

app.use(cors(createCorsOptions()));

app.use(cookieParser());

// Limit payload size to prevent DoS (Checklist #7, #8)
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rate Limiter for Authentication (Checklist #2)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Relaxed limit in dev
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.get("/", (req, res) => {
  res.send("Dating App Backend is running!");
});

const paymentRoutes = initPaymentModule();
app.use("/api/payments", paymentRoutes);

const authRoutes = initAuthModule();
app.use("/api/auth", authLimiter, authRoutes); // Apply rate limiter to auth

app.use(userModule);
app.use(matchModule);
app.use(messageModule);
app.use(feedModule);
app.use(notificationModule);
app.use(adminModule);

import sequelize from "./config/db";
import { seedMockData } from "./utils/seedMockData";
import { ensureUserColumns } from "./config/ensureUserColumns";

// Health check
app.get("/api", (req, res) => {
  res.json({
    status: "OK",
    message: "HeartConnect API is running",
    version: "1.0",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Start server immediately to bind port and satisfy health checks
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);

  // Keep-alive self-ping for Render Free Tier (pings every 14 minutes to prevent sleep)
  const renderUrl =
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://heartconnect-qa29.onrender.com"
      : null);

  if (renderUrl) {
    console.log(
      `[KeepAlive] Registered background self-ping to ${renderUrl}/api/health every 14 mins`,
    );
    setInterval(async () => {
      try {
        await axios.get(`${renderUrl}/api/health`);
        console.log(
          `[KeepAlive] Self-ping successful at ${new Date().toISOString()}`,
        );
      } catch (e: any) {
        console.warn(`[KeepAlive] Ping failed: ${e.message}`);
      }
    }, 14 * 60 * 1000);
  }
});

// Sync database and seed mock data asynchronously in the background
sequelize
  .sync()
  .then(async () => {
    await ensureUserColumns();
    console.log("Database synced successfully");
    await seedMockData();
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
