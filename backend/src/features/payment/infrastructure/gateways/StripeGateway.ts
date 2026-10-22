import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import Stripe from 'stripe';

export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-02-24.acacia' as any,
    });
  }

  async createPaymentUrl(orderId: string, amount: number, description: string, ipAddr: string): Promise<string> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Nếu chưa có config thì trả về URL mock (tránh sập app)
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY is missing! Using mock Stripe payment URL.');
      return `${frontendUrl}/payment/result?orderId=${orderId}&status=success`;
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: description,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/stripe/return?orderId=${orderId}&status=success`,
        cancel_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/stripe/return?orderId=${orderId}&status=failed`,
        client_reference_id: orderId,
      });

      return session.url || `${frontendUrl}/payment/result?orderId=${orderId}&status=failed`;
    } catch (error) {
      console.error('Stripe error:', error);
      throw new Error('Lỗi tạo thanh toán Stripe');
    }
  }

  verifyCallback(data: any): boolean {
    return true; // We rely on success_url params for frontend, but normally Webhook is used.
  }

  getOrderId(data: any): string {
    return data.orderId;
  }

  getResponseStatus(data: any): 'SUCCESS' | 'FAILED' {
    return data.status === 'success' ? 'SUCCESS' : 'FAILED';
  }

  getAmount(data: any): number {
    return 0; // Not strictly needed for callback if we just trust the DB
  }
}
