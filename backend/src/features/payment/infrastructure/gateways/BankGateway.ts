import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import { BankTransferDetails } from '../../domain/BankTransfer';
import { Transaction } from '../../domain/entities/Transaction';
import { bankPaymentMode, directBankDetails } from '../directBankConfig';
import { SePayGateway } from './SePayGateway';

export class BankGateway implements IPaymentGateway {
  constructor(private sepay = new SePayGateway()) {}

  async getPaymentDetails(_orderId: string, amount: number, planId: string): Promise<BankTransferDetails> {
    return bankPaymentMode() === 'direct' ? directBankDetails(planId, amount) : this.sepay.getPaymentDetails();
  }

  async createPaymentUrl(orderId: string): Promise<string> {
    return bankPaymentMode() === 'direct' ? `/payment/bank/${encodeURIComponent(orderId)}` : this.sepay.createPaymentUrl(orderId);
  }

  checkout(tx: Transaction) {
    return tx.paymentDetails?.mode === 'direct' ? null : this.sepay.checkout(tx);
  }

  async verifyCallback(data: any, tx: Transaction): Promise<boolean> {
    // A direct QR has no SePay gateway invoice. Only an admin can reconcile its bank receipt.
    if (tx.paymentDetails?.mode === 'direct') return false;
    return this.sepay.verifyCallback(data, tx);
  }

  getOrderId(data: any) { return this.sepay.getOrderId(data); }
  getResponseStatus(data: any) { return this.sepay.getResponseStatus(data); }
  getAmount(data: any) { return this.sepay.getAmount(data); }
}
