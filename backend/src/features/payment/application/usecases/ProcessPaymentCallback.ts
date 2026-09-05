import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IPaymentGateway } from '../ports/IPaymentGateway';

export class ProcessPaymentCallbackUseCase {
  constructor(
    private transactionRepo: ITransactionRepository,
    private paymentGateways: Record<string, IPaymentGateway>
  ) {}

  async execute(provider: 'VNPAY' | 'MOMO', queryData: any): Promise<{ success: boolean, orderId: string }> {
    const gateway = this.paymentGateways[provider];
    if (!gateway) throw new Error('Provider not supported');

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
    } else {
      await this.transactionRepo.updateStatus(orderId, 'FAILED');
    }

    return { success: status === 'SUCCESS', orderId };
  }
}