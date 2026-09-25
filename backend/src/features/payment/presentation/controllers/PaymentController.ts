import { Request, Response } from 'express';
import { CreatePaymentUseCase } from '../../application/usecases/CreatePayment';
import { ProcessPaymentCallbackUseCase } from '../../application/usecases/ProcessPaymentCallback';

export class PaymentController {
  constructor(
    private createPaymentUseCase: CreatePaymentUseCase,
    private processCallbackUseCase: ProcessPaymentCallbackUseCase
  ) {}

  async createVNPay(req: Request, res: Response) {
    try {
      const { orderId, amount, description, userId, planId } = req.body;
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const paymentUrl = await this.createPaymentUseCase.execute('VNPAY', orderId, amount, description || `Thanh toan ${orderId}`, userId, planId, ipAddr as string);
      res.json({ success: true, provider: 'vnpay', paymentUrl, transactionId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán VNPay' });
    }
  }

  async createMoMo(req: Request, res: Response) {
    try {
      const { orderId, amount, description, userId, planId } = req.body;
      const paymentUrl = await this.createPaymentUseCase.execute('MOMO', orderId, amount, description || `Thanh toan ${orderId}`, userId, planId, '');
      res.json({ success: true, provider: 'momo', paymentUrl, transactionId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán MoMo' });
    }
  }

  async createCard(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const paymentUrl = `${frontendUrl}/payment/result?orderId=${orderId}&status=success`;
      res.json({ success: true, provider: 'card', paymentUrl, transactionId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán Thẻ' });
    }
  }

  async createPayPal(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const paymentUrl = `${frontendUrl}/payment/result?orderId=${orderId}&status=success`;
      res.json({ success: true, provider: 'paypal', paymentUrl, transactionId: orderId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi tạo thanh toán PayPal' });
    }
  }

  async vnpayReturn(req: Request, res: Response) {
    try {
      const { orderId, success } = await this.processCallbackUseCase.execute('VNPAY', req.query);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/payment/result?orderId=${orderId}&status=${success ? 'success' : 'failed'}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Lỗi máy chủ');
    }
  }

  async momoIpn(req: Request, res: Response) {
    try {
      await this.processCallbackUseCase.execute('MOMO', req.body);
      res.status(200).json({ message: 'Received' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Lỗi xử lý IPN' });
    }
  }
}