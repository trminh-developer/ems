"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
class PaymentController {
  createPaymentUseCase;
  processCallbackUseCase;
  constructor(createPaymentUseCase, processCallbackUseCase) {
    this.createPaymentUseCase = createPaymentUseCase;
    this.processCallbackUseCase = processCallbackUseCase;
  }
  async createVNPay(req, res) {
    try {
      const { orderId, amount, description, userId, planId } = req.body;
      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "127.0.0.1";
      const paymentUrl = await this.createPaymentUseCase.execute(
        "VNPAY",
        orderId,
        amount,
        description || `Thanh toan ${orderId}`,
        userId,
        planId,
        ipAddr,
      );
      res.json({
        success: true,
        provider: "vnpay",
        paymentUrl,
        transactionId: orderId,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi tạo thanh toán VNPay" });
    }
  }
  async createMoMo(req, res) {
    try {
      const { orderId, amount, description, userId, planId } = req.body;
      const paymentUrl = await this.createPaymentUseCase.execute(
        "MOMO",
        orderId,
        amount,
        description || `Thanh toan ${orderId}`,
        userId,
        planId,
        "",
      );
      res.json({
        success: true,
        provider: "momo",
        paymentUrl,
        transactionId: orderId,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi tạo thanh toán MoMo" });
    }
  }
  async createCard(req, res) {
    try {
      const { orderId } = req.body;
      const paymentUrl = `http://localhost:5173/payment/result?orderId=${orderId}&status=success`;
      res.json({
        success: true,
        provider: "card",
        paymentUrl,
        transactionId: orderId,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi tạo thanh toán Thẻ" });
    }
  }
  async createPayPal(req, res) {
    try {
      const { orderId } = req.body;
      const paymentUrl = `http://localhost:5173/payment/result?orderId=${orderId}&status=success`;
      res.json({
        success: true,
        provider: "paypal",
        paymentUrl,
        transactionId: orderId,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi tạo thanh toán PayPal" });
    }
  }
  async vnpayReturn(req, res) {
    try {
      const { orderId, success } = await this.processCallbackUseCase.execute(
        "VNPAY",
        req.query,
      );
      res.redirect(
        `http://localhost:5173/payment/result?orderId=${orderId}&status=${success ? "success" : "failed"}`,
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi máy chủ");
    }
  }
  async momoIpn(req, res) {
    try {
      await this.processCallbackUseCase.execute("MOMO", req.body);
      res.status(200).json({ message: "Received" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Lỗi xử lý IPN" });
    }
  }
}
exports.PaymentController = PaymentController;
