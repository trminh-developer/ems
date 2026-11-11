import { Transaction } from '../../domain/entities/Transaction';

export interface IPaymentGateway {
  createPaymentUrl(
    orderId: string,
    amount: number,
    description: string,
    ipAddr?: string,
  ): Promise<string>;
  verifyCallback(data: any, transaction: Transaction): boolean | Promise<boolean>;
  getOrderId(data: any): string;
  getResponseStatus(data: any): "SUCCESS" | "FAILED";
  getAmount(data: any): number;
}
