"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPaymentModule = void 0;
const SupabaseTransactionRepository_1 = require("../infrastructure/repositories/SupabaseTransactionRepository");
const VNPayGateway_1 = require("../infrastructure/gateways/VNPayGateway");
const MoMoGateway_1 = require("../infrastructure/gateways/MoMoGateway");
const CreatePayment_1 = require("../application/usecases/CreatePayment");
const ProcessPaymentCallback_1 = require("../application/usecases/ProcessPaymentCallback");
const PaymentController_1 = require("../presentation/controllers/PaymentController");
const PaymentRoutes_1 = require("../presentation/routes/PaymentRoutes");
const initPaymentModule = () => {
  const transactionRepo =
    new SupabaseTransactionRepository_1.SupabaseTransactionRepository();
  const gateways = {
    VNPAY: new VNPayGateway_1.VNPayGateway(),
    MOMO: new MoMoGateway_1.MoMoGateway(),
  };
  const createPaymentUC = new CreatePayment_1.CreatePaymentUseCase(
    transactionRepo,
    gateways,
  );
  const processCallbackUC =
    new ProcessPaymentCallback_1.ProcessPaymentCallbackUseCase(
      transactionRepo,
      gateways,
    );
  const paymentController = new PaymentController_1.PaymentController(
    createPaymentUC,
    processCallbackUC,
  );
  return (0, PaymentRoutes_1.setupPaymentRoutes)(paymentController);
};
exports.initPaymentModule = initPaymentModule;
