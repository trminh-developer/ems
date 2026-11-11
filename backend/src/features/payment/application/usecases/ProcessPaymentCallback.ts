import { ITransactionRepository } from "../ports/ITransactionRepository";
import { IPaymentGateway } from "../ports/IPaymentGateway";

export class ProcessPaymentCallbackUseCase {
  constructor(
    private transactionRepo: ITransactionRepository,
    private paymentGateways: Record<string, IPaymentGateway>,
  ) {}

  async execute(
    provider: string,
    queryData: any,
  ): Promise<{ success: boolean; orderId: string }> {
    const gateway = this.paymentGateways[provider];
    if (!gateway) throw new Error("Provider not supported");

    const orderId = gateway.getOrderId(queryData);
    if (typeof orderId !== 'string' || !orderId) throw new Error('Invalid order ID');
    const tx = await this.transactionRepo.findById(orderId);
    if (!tx || tx.provider !== provider) throw new Error('Invalid transaction or provider');
    const isValid = await gateway.verifyCallback(queryData, tx);

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    if (Number(gateway.getAmount(queryData)) !== Number(tx.amount)) throw new Error('Payment amount mismatch');
    const status = gateway.getResponseStatus(queryData);
    await this.transactionRepo.settle(orderId, status);

    return { success: status === "SUCCESS" || tx.status === 'SUCCESS', orderId };
  }
}
