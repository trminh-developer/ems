"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentCallbackUseCase = void 0;
class ProcessPaymentCallbackUseCase {
    transactionRepo;
    paymentGateways;
    constructor(transactionRepo, paymentGateways) {
        this.transactionRepo = transactionRepo;
        this.paymentGateways = paymentGateways;
    }
    async execute(provider, queryData) {
        const gateway = this.paymentGateways[provider];
        if (!gateway)
            throw new Error('Provider not supported');
        const isValid = gateway.verifyCallback(queryData);
        const orderId = gateway.getOrderId(queryData);
        const status = gateway.getResponseStatus(queryData);
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        if (status === 'SUCCESS') {
            await this.transactionRepo.updateStatus(orderId, 'SUCCESS');
            const tx = await this.transactionRepo.findById(orderId);
            if (tx) {
                await this.transactionRepo.upgradeUserPremium(tx.userId, tx.planId);
            }
        }
        else {
            await this.transactionRepo.updateStatus(orderId, 'FAILED');
        }
        return { success: status === 'SUCCESS', orderId };
    }
}
exports.ProcessPaymentCallbackUseCase = ProcessPaymentCallbackUseCase;
