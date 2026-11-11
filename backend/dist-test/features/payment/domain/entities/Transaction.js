"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
  id;
  userId;
  planId;
  amount;
  status;
  provider;
  createdAt;
  constructor(id, userId, planId, amount, status, provider, createdAt) {
    this.id = id;
    this.userId = userId;
    this.planId = planId;
    this.amount = amount;
    this.status = status;
    this.provider = provider;
    this.createdAt = createdAt;
  }
}
exports.Transaction = Transaction;
