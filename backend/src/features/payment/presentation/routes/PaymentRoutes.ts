import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';

export const setupPaymentRoutes = (controller: PaymentController): Router => {
  const router = Router();
  router.post('/vnpay/create', (req, res) => controller.createVNPay(req, res));
  router.get('/vnpay/return', (req, res) => controller.vnpayReturn(req, res));
  router.post('/momo/create', (req, res) => controller.createMoMo(req, res));
  router.post('/momo/ipn', (req, res) => controller.momoIpn(req, res));
  return router;
};