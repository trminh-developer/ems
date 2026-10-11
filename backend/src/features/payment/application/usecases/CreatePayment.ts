import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IPaymentGateway } from '../ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';

export class CreatePaymentUseCase {
  constructor(
    private transactionRepo: ITransactionRepository,
    private paymentGateways: Record<string, IPaymentGateway>
  ) {}

  async execute(provider: 'VNPAY' | 'MOMO' | 'CARD' | 'PAYPAL', orderId: string, amount: number, description: string, userId: string, planId: string, ipAddr: string): Promise<string> {
    const transaction = new Transaction(orderId, userId, planId, amount, 'PENDING', provider, new Date());
    await this.transactionRepo.save(transaction);

    const gateway = this.paymentGateways[provider];
    if (!gateway) throw new Error('Provider not supported');

    return await gateway.createPaymentUrl(orderId, amount, description, ipAddr);
  }
}
