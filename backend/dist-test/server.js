"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const PaymentModule_1 = require("./features/payment/di/PaymentModule");
const AuthModule_1 = require("./features/auth/AuthModule");
const UserModule_1 = __importDefault(require("./features/user/UserModule"));
const MatchModule_1 = __importDefault(require("./features/match/MatchModule"));
const MessageModule_1 = __importDefault(
  require("./features/message/MessageModule"),
);
const FeedModule_1 = __importDefault(require("./features/feed/FeedModule"));
const NotificationModule_1 = __importDefault(
  require("./features/notification/NotificationModule"),
);
const AdminModule_1 = __importDefault(require("./features/admin/AdminModule"));
// Load env vars
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
// Routes
app.get("/", (req, res) => {
  res.send("Dating App Payment Backend is running!");
});
const paymentRoutes = (0, PaymentModule_1.initPaymentModule)();
app.use("/api/payments", paymentRoutes);
const authRoutes = (0, AuthModule_1.initAuthModule)();
app.use("/api/auth", authRoutes);
app.use(UserModule_1.default);
app.use(MatchModule_1.default);
app.use(MessageModule_1.default);
app.use(FeedModule_1.default);
app.use(NotificationModule_1.default);
app.use(AdminModule_1.default);
const db_1 = __importDefault(require("./config/db"));
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
// Sync database and start server
db_1.default
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
    // Vẫn bật server kể cả khi DB lỗi để lấy log
    app.listen(PORT, () => {
      console.log(
        `Backend server is running (DB Error) on http://localhost:${PORT}`,
      );
    });
  });
