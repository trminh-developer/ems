import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { requireAuth } from '../../../../middlewares/authMiddleware';

export const setupPaymentRoutes = (controller: PaymentController): Router => {
  const router = Router();
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
