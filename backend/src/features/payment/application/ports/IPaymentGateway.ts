import { Transaction } from '../../domain/entities/Transaction';
import type { BankTransferDetails } from '../../domain/BankTransfer';

export interface IPaymentGateway {
  getPaymentDetails?(orderId: string, amount: number, planId: string): Promise<BankTransferDetails>;
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
