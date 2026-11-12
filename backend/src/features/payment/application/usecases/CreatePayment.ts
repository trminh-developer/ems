import { randomUUID } from 'crypto';
import { ITransactionRepository } from '../ports/ITransactionRepository';
import { IPaymentGateway } from '../ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';
import { getPremiumPlan } from '../../domain/PremiumPlans';

export class CreatePaymentUseCase {
  constructor(
    private transactionRepo: ITransactionRepository,
    private paymentGateways: Record<string, IPaymentGateway>,
  ) {}

  async execute(provider: string, userId: string, planId: string, ipAddr: string): Promise<{ paymentUrl: string; orderId: string }> {
    const plan = getPremiumPlan(planId);
    const gateway = this.paymentGateways[provider];
    if (!gateway) throw new Error('Provider not supported');
    const orderId = randomUUID();
    const paymentDetails = await gateway.getPaymentDetails?.(orderId, plan.price, planId);
    await this.transactionRepo.save(new Transaction(orderId, userId, planId, plan.price, 'PENDING', provider, new Date(), paymentDetails));
    try {
      const paymentUrl = await gateway.createPaymentUrl(orderId, plan.price, `Thanh toan Premium ${plan.title}`, ipAddr);
      return { paymentUrl, orderId };
    } catch (error) {
      await this.transactionRepo.settle(orderId, 'FAILED');
      throw error;
    }
  }
}
