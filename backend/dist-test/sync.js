"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
require("./models/index");
db_1.default
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
    process.exit(1);
  });
