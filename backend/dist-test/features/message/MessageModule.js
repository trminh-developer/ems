"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessageController_1 = require("./MessageController");
const router = (0, express_1.Router)();
router.get(
  "/api/messages/conversations/:userId",
  MessageController_1.getConversations,
);
router.get("/api/messages/:conversationId", MessageController_1.getMessages);
router.post("/api/messages", MessageController_1.sendMessage);
router.put(
  "/api/messages/:conversationId/read",
  MessageController_1.markAsRead,
);
router.delete("/api/messages/:messageId", MessageController_1.deleteMessage);
exports.default = router;
