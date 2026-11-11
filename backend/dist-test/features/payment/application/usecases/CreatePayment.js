"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentUseCase = void 0;
const Transaction_1 = require("../../domain/entities/Transaction");
class CreatePaymentUseCase {
  transactionRepo;
  paymentGateways;
  constructor(transactionRepo, paymentGateways) {
    this.transactionRepo = transactionRepo;
    this.paymentGateways = paymentGateways;
  }
  async execute(
    provider,
    orderId,
    amount,
    description,
    userId,
    planId,
    ipAddr,
  ) {
    const transaction = new Transaction_1.Transaction(
      orderId,
      userId,
      planId,
      amount,
      "PENDING",
      provider,
      new Date(),
    );
    await this.transactionRepo.save(transaction);
    const gateway = this.paymentGateways[provider];
    if (!gateway) throw new Error("Provider not supported");
    return await gateway.createPaymentUrl(orderId, amount, description, ipAddr);
  }
}
exports.CreatePaymentUseCase = CreatePaymentUseCase;
