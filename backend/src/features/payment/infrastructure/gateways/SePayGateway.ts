import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';
import { BankTransferDetails } from '../../domain/BankTransfer';
import { createSePayClient, getSePayConfig, paymentFrontendUrl } from '../sepayConfig';

type RetrieveOrder = (invoice: string) => Promise<any>;
const retrieveOrder: RetrieveOrder = async invoice => {
  const response = await createSePayClient().order.makeHttpRequest('GET', `order/detail/${encodeURIComponent(invoice)}`, { timeout: 12000 });
  return response.data?.data;
};

export class SePayGateway implements IPaymentGateway {
  constructor(private retrieve: RetrieveOrder = retrieveOrder) {}

  async getPaymentDetails(): Promise<BankTransferDetails> { return { environment: getSePayConfig().env }; }

  async createPaymentUrl(orderId: string): Promise<string> {
    getSePayConfig();
    return `/payment/bank/${encodeURIComponent(orderId)}`;
  }

  checkout(tx: Transaction) {
    const config = getSePayConfig();
    if (tx.provider !== 'BANK' || tx.paymentDetails?.environment !== config.env) {
      throw Object.assign(new Error('Đơn hàng thuộc môi trường thanh toán khác. Vui lòng tạo đơn mới.'), { statusCode: 409 });
    }
    const client = createSePayClient();
    const resultUrl = `${paymentFrontendUrl()}/payment/result?orderId=${encodeURIComponent(tx.id)}`;
    // The SDK signs in insertion order. Keep the documented SePay signing field order.
    const fields = client.checkout.initOneTimePaymentFields({
      order_amount: tx.amount, merchant: config.merchant_id, currency: 'VND', operation: 'PURCHASE',
      order_description: `Thanh toan Premium ${tx.planId}`, order_invoice_number: tx.id,
      customer_id: tx.userId, payment_method: 'BANK_TRANSFER',
      success_url: resultUrl, error_url: resultUrl + '&status=failed', cancel_url: resultUrl + '&status=cancelled',
    });
    // Transport names as values so API key-camelization cannot alter signed form fields.
    return { environment: config.env, checkoutUrl: client.checkout.initCheckoutUrl(), fields: Object.entries(fields).map(([name, value]) => ({ name, value })) };
  }

  async verifyCallback(data: any, tx: Transaction): Promise<boolean> {
    data.verifiedPaid = false;
    delete data.verifiedAmount; delete data.verifiedReference;
    const config = getSePayConfig();
    if (tx.paymentDetails?.environment !== config.env) return false;
    let order: any;
    try { order = await this.retrieve(tx.id); }
    catch (error: any) {
      if (error.response?.status === 404) return false;
      throw Object.assign(new Error('Chưa thể đối soát giao dịch với SePay. Vui lòng thử lại.'), { statusCode: 502 });
    }
    if (!order || order.order_invoice_number !== tx.id || order.order_status !== 'CAPTURED' ||
      order.order_currency !== 'VND' || Number(order.order_amount) !== tx.amount || !Array.isArray(order.transactions)) return false;
    const payment = order.transactions.find((item: any) => item.payment_method === 'BANK_TRANSFER' &&
      item.transaction_type === 'PAYMENT' && item.transaction_status === 'APPROVED' &&
      item.transaction_currency === 'VND' && Number(item.transaction_amount) === tx.amount);
    const reference = payment && String(payment.transaction_id || payment.id || order.order_id || '');
    if (!reference || reference.length > 80) return false;
    data.verifiedPaid = true; data.verifiedAmount = tx.amount;
    data.verifiedReference = config.env + ':' + reference;
    return true;
  }

  getOrderId(data: any): string { return data.orderId; }
  getResponseStatus(data: any): 'SUCCESS' | 'FAILED' { return data.verifiedPaid ? 'SUCCESS' : 'FAILED'; }
  getAmount(data: any): number { return Number(data.verifiedAmount); }
}
