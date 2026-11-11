import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';
import axios from 'axios';

export class PayPalGateway implements IPaymentGateway {
  private getBaseUrl() {
    return process.env.PAYMENT_MODE === 'production'
      ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const { PAYPAL_CLIENT_ID: clientId, PAYPAL_SECRET: secret } = process.env;
    if (!clientId || !secret) throw new Error('Chưa cấu hình thông tin PayPal sandbox.');
    const response = await axios.post(`${this.getBaseUrl()}/v1/oauth2/token`, 'grant_type=client_credentials', {
      auth: { username: clientId, password: secret },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 20000,
    });
    return response.data.access_token;
  }

  async createPaymentUrl(orderId: string, amount: number, description: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Fixed checkout conversion; the same value is verified before capture.
    const usdAmount = (amount / 25000).toFixed(2);
    const response = await axios.post(`${this.getBaseUrl()}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId, description,
        amount: { currency_code: 'USD', value: usdAmount },
      }],
      application_context: {
        return_url: `${backendUrl}/api/payments/paypal/return?orderId=${orderId}`,
        cancel_url: `${frontendUrl}/payment/result?orderId=${orderId}&status=cancelled`,
        user_action: 'PAY_NOW',
      },
    }, {
      headers: { Authorization: `Bearer ${accessToken}`, 'PayPal-Request-Id': orderId },
      timeout: 20000,
    });
    const link = response.data.links?.find((item: any) => item.rel === 'approve');
    if (!link?.href) throw new Error('PayPal không trả về liên kết thanh toán.');
    return link.href;
  }

  async verifyCallback(data: any, tx: Transaction): Promise<boolean> {
    if (typeof data.token !== 'string' || !/^[A-Z0-9]+$/.test(data.token)) return false;
    const token = await this.getAccessToken();
    const url = `${this.getBaseUrl()}/v2/checkout/orders/${encodeURIComponent(data.token)}`;
    const config = { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 };
    const response = await axios.get(url, config);
    const order = response.data;
    const unit = order.purchase_units?.[0];
    if (order.intent !== 'CAPTURE' || order.purchase_units?.length !== 1 ||
      unit?.reference_id !== tx.id || unit.amount?.currency_code !== 'USD' ||
      Number(unit.amount?.value) !== Number((tx.amount / 25000).toFixed(2))) return false;
    let completed = order;
    if (order.status === 'APPROVED') {
      const captured = await axios.post(`${url}/capture`, {}, {
        ...config, headers: { ...config.headers, 'PayPal-Request-Id': `capture-${tx.id}` },
      });
      completed = captured.data;
    }
    const captures = completed.purchase_units?.[0]?.payments?.captures || [];
    const paid = completed.status === 'COMPLETED' && captures.length === 1 &&
      captures[0].status === 'COMPLETED' && captures[0].amount?.currency_code === 'USD' &&
      Number(captures[0].amount?.value) === Number(unit.amount.value);
    if (paid) {
      data.verifiedPaid = true;
      data.verifiedAmount = tx.amount;
    }
    return paid;
  }

  getOrderId(data: any): string { return data.orderId; }
  getResponseStatus(data: any): 'SUCCESS' | 'FAILED' { return data.verifiedPaid ? 'SUCCESS' : 'FAILED'; }
  getAmount(data: any): number { return data.verifiedAmount; }
}
