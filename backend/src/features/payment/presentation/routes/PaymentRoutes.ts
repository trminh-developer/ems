import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { requireAuth } from '../../../../middlewares/authMiddleware';
import { BankPaymentController } from '../controllers/BankPaymentController';

export const setupPaymentRoutes = (controller: PaymentController): Router => {
  const router = Router();
  const bank = new BankPaymentController();
  router.get('/methods', bank.methods);
  router.post('/bank/create', requireAuth, (req, res) => controller.create(req, res, 'BANK'));
  router.get('/bank/pending', requireAuth, bank.pending);
  router.get('/bank/:orderId', requireAuth, bank.details);
  router.post('/bank/:orderId/submit', requireAuth, bank.submit);
  router.post('/bank/:orderId/confirm', requireAuth, bank.confirm);
  router.post('/sepay/ipn', (req, res) => controller.sepayIpn(req, res));
  router.post("/vnpay/create", requireAuth, (req, res) => controller.create(req, res, 'VNPAY'));
  router.get("/vnpay/return", (req, res) => controller.paymentReturn(req, res, 'VNPAY'));
  router.get("/vnpay/ipn", (req, res) => controller.vnpayIpn(req, res));
  router.post("/momo/create", requireAuth, (req, res) => controller.create(req, res, 'MOMO'));
  router.get("/momo/return", (req, res) => controller.paymentReturn(req, res, 'MOMO'));
  router.post("/momo/ipn", (req, res) => controller.momoIpn(req, res));
  router.post("/card/create", requireAuth, (req, res) => controller.create(req, res, 'CARD'));
  router.get("/stripe/return", (req, res) => controller.paymentReturn(req, res, 'CARD'));
  router.post("/stripe/webhook", (req, res) => controller.stripeWebhook(req, res));
  router.get("/:orderId/status", requireAuth, (req, res) => controller.getStatus(req, res));
  router.post("/paypal/create", requireAuth, (req, res) =>
    controller.create(req, res, 'PAYPAL'),
  );
  router.get("/paypal/return", (req, res) => controller.paymentReturn(req, res, 'PAYPAL'));
  return router;
};
