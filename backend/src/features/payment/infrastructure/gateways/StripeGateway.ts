import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';
import Stripe from 'stripe';

export class StripeGateway implements IPaymentGateway {
  private client() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Chưa cấu hình STRIPE_SECRET_KEY cho thanh toán sandbox.');
    if (process.env.PAYMENT_MODE !== 'production' && !key.startsWith('sk_test_')) {
      throw new Error('Sandbox yêu cầu Stripe test key.');
    }
    return new Stripe(key);
  }

  async createPaymentUrl(orderId: string, amount: number, description: string): Promise<string> {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await this.client().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: { currency: 'vnd', product_data: { name: description }, unit_amount: amount },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${backendUrl}/api/payments/stripe/return?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/result?orderId=${orderId}&status=cancelled`,
      client_reference_id: orderId,
    });
    if (!session.url) throw new Error('Stripe không trả về liên kết thanh toán.');
    return session.url;
  }

  async verifyCallback(data: any, tx: Transaction): Promise<boolean> {
    if (typeof data.session_id !== 'string') return false;
    const session = await this.client().checkout.sessions.retrieve(data.session_id);
    const valid = session.client_reference_id === tx.id &&
      session.currency === 'vnd' && session.amount_total === tx.amount &&
      session.livemode === (process.env.PAYMENT_MODE === 'production') &&
      session.payment_status === 'paid' && session.status === 'complete';
    if (valid) {
      data.verifiedAmount = session.amount_total;
      data.verifiedPaid = true;
    }
    return valid;
  }

  getOrderId(data: any): string { return data.orderId; }
  getResponseStatus(data: any): 'SUCCESS' | 'FAILED' { return data.verifiedPaid ? 'SUCCESS' : 'FAILED'; }
  getAmount(data: any): number { return data.verifiedAmount; }
}
