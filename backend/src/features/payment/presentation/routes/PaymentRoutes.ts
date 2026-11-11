import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";

export const setupPaymentRoutes = (controller: PaymentController): Router => {
  const router = Router();
  router.post("/vnpay/create", (req, res) => controller.createVNPay(req, res));
  router.get("/vnpay/return", (req, res) => controller.vnpayReturn(req, res));
  router.post("/momo/create", (req, res) => controller.createMoMo(req, res));
  router.post("/momo/ipn", (req, res) => controller.momoIpn(req, res));
  router.post("/card/create", (req, res) => controller.createCard(req, res));
  router.get("/stripe/return", (req, res) => controller.stripeReturn(req, res));
  router.post("/paypal/create", (req, res) =>
    controller.createPayPal(req, res),
  );
  router.get("/paypal/return", (req, res) => controller.paypalReturn(req, res));
  return router;
};
