"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use DATABASE_URL from .env if available, otherwise fallback to localhost for development
const dbUrl =
  process.env.DATABASE_URL || "mysql://root:@localhost:3306/dating_app";
const isProduction =
  process.env.NODE_ENV === "production" ||
  dbUrl.includes("aivencloud") ||
  dbUrl.includes("render");
const sequelize = new sequelize_1.Sequelize(dbUrl, {
  logging: false,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});
exports.default = sequelize;
