import { Request, Response } from 'express';
import Stripe from 'stripe';
import { timingSafeEqual } from 'node:crypto';
import { AuthRequest } from '../../../../middlewares/authMiddleware';
import { CreatePaymentUseCase } from '../../application/usecases/CreatePayment';
import { ProcessPaymentCallbackUseCase } from '../../application/usecases/ProcessPaymentCallback';
import { Transaction } from '../../../../models';
import { getSePayConfig } from '../../infrastructure/sepayConfig';

export class PaymentController {
  private bankChecks = new Map<string, Promise<unknown>>();
  constructor(
    private createPaymentUseCase: CreatePaymentUseCase,
    private processCallbackUseCase: ProcessPaymentCallbackUseCase,
  ) {}

  async create(req: AuthRequest, res: Response, provider: string) {
    try {
      const planId = req.body?.planId;
      if (typeof planId !== 'string') return res.status(400).json({ error: 'Vui lòng chọn gói Premium.' });
      const { paymentUrl, orderId } = await this.createPaymentUseCase.execute(
        provider, req.user.id, planId, req.ip || '127.0.0.1',
      );
      return res.json({ success: true, provider: provider.toLowerCase(), paymentUrl, transactionId: orderId });
    } catch (error: any) {
      console.error('Payment creation failed:', error.message);
      return res.status(error.statusCode || 502).json({ success: false, error: error.message });
    }
  }

  async getStatus(req: AuthRequest, res: Response) {
    try {
      const tx: any = await Transaction.findOne({ where: { id: req.params.orderId, user_id: req.user.id } });
      if (!tx) return res.status(404).json({ error: 'Không tìm thấy giao dịch.' });
      const manual = tx.provider === 'BANK' && tx.payment_details?.mode === 'direct';
      if (tx.provider === 'BANK' && tx.status === 'PENDING' && !manual) {
        let check = this.bankChecks.get(tx.id);
        if (!check) {
          check = this.processCallbackUseCase.execute('BANK', { orderId: tx.id }).catch(() => undefined).finally(() => this.bankChecks.delete(tx.id));
          this.bankChecks.set(tx.id, check);
        }
        await check;
        await tx.reload();
      }
      return res.json({ orderId: tx.id, status: tx.status, planId: tx.plan_id, confirmationMode: manual ? 'manual' : 'automatic' });
    } catch (error) {
      return res.status(500).json({ error: 'Không thể kiểm tra giao dịch.' });
    }
  }

  async sepayIpn(req: Request, res: Response) {
    try {
      const config = getSePayConfig();
      const expected = Buffer.from(process.env.SEPAY_IPN_SECRET || config.secret_key);
      const supplied = Buffer.from(req.get('X-Secret-Key') || '');
      if (!supplied.length || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return res.sendStatus(401);
      if (req.body?.notification_type !== 'ORDER_PAID') return res.json({ success: true });
      const orderId = req.body?.order?.order_invoice_number;
      if (typeof orderId !== 'string' || !/^[a-f0-9-]{36}$/i.test(orderId)) return res.status(400).json({ error: 'Mã đơn hàng không hợp lệ.' });
      // Re-read the order through the authenticated SePay API before granting Premium.
      await this.processCallbackUseCase.execute('BANK', { orderId });
      return res.json({ success: true });
    } catch (error: any) {
      console.warn('SePay IPN verification failed:', error.message);
      return res.status(error.statusCode || 422).json({ error: 'Chưa xác nhận được giao dịch SePay.' });
    }
  }

  async paymentReturn(req: Request, res: Response, provider: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
      const { orderId, success } = await this.processCallbackUseCase.execute(provider, req.query);
      return res.redirect(`${frontendUrl}/payment/result?orderId=${encodeURIComponent(orderId)}&status=${success ? 'success' : 'failed'}`);
    } catch (error: any) {
      console.error('Payment return failed:', error.message);
      const orderId = String(req.query.orderId || req.query.vnp_TxnRef || '');
      return res.redirect(`${frontendUrl}/payment/result?orderId=${encodeURIComponent(orderId)}&status=unconfirmed`);
    }
  }

  async momoIpn(req: Request, res: Response) {
    try {
      await this.processCallbackUseCase.execute('MOMO', req.body);
      return res.status(204).send();
    } catch (error: any) {
      console.error('MoMo IPN failed:', error.message);
      return res.status(400).json({ error: 'Không thể xác nhận giao dịch.' });
    }
  }

  async vnpayIpn(req: Request, res: Response) {
    try {
      await this.processCallbackUseCase.execute('VNPAY', req.query);
      return res.json({ RspCode: '00', Message: 'Confirm Success' });
    } catch (error: any) {
      const codes: Record<string, string> = {
        'Invalid signature': '97', 'Invalid transaction or provider': '01', 'Payment amount mismatch': '04',
      };
      return res.json({ RspCode: codes[error.message] || '99', Message: 'Cannot confirm payment' });
    }
  }

  async stripeWebhook(req: Request, res: Response) {
    try {
      const key = process.env.STRIPE_SECRET_KEY;
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      const signature = req.headers['stripe-signature'];
      if (!key || !secret || typeof signature !== 'string') return res.sendStatus(400);
      const event = new Stripe(key).webhooks.constructEvent(req.body, signature, secret);
      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await this.processCallbackUseCase.execute('CARD', { orderId: session.client_reference_id, session_id: session.id });
        }
      }
      return res.json({ received: true });
    } catch (error: any) {
      console.error('Stripe webhook failed:', error.message);
      return res.sendStatus(400);
    }
  }
}
