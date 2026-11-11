"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPaymentRoutes = void 0;
const express_1 = require("express");
const setupPaymentRoutes = (controller) => {
  const router = (0, express_1.Router)();
  router.post("/vnpay/create", (req, res) => controller.createVNPay(req, res));
  router.get("/vnpay/return", (req, res) => controller.vnpayReturn(req, res));
  router.post("/momo/create", (req, res) => controller.createMoMo(req, res));
  router.post("/momo/ipn", (req, res) => controller.momoIpn(req, res));
  router.post("/card/create", (req, res) => controller.createCard(req, res));
  router.post("/paypal/create", (req, res) =>
    controller.createPayPal(req, res),
  );
  return router;
};
exports.setupPaymentRoutes = setupPaymentRoutes;
