import { SupabaseTransactionRepository } from '../infrastructure/repositories/SupabaseTransactionRepository';
import { VNPayGateway } from '../infrastructure/gateways/VNPayGateway';
import { MoMoGateway } from '../infrastructure/gateways/MoMoGateway';
import { CreatePaymentUseCase } from '../application/usecases/CreatePayment';
import { ProcessPaymentCallbackUseCase } from '../application/usecases/ProcessPaymentCallback';
import { PaymentController } from '../presentation/controllers/PaymentController';
import { setupPaymentRoutes } from '../presentation/routes/PaymentRoutes';

export const initPaymentModule = () => {
  const transactionRepo = new SupabaseTransactionRepository();
  const gateways = {
    'VNPAY': new VNPayGateway(),
    'MOMO': new MoMoGateway()
  };

  const createPaymentUC = new CreatePaymentUseCase(transactionRepo, gateways);
  const processCallbackUC = new ProcessPaymentCallbackUseCase(transactionRepo, gateways);

  const paymentController = new PaymentController(createPaymentUC, processCallbackUC);

  return setupPaymentRoutes(paymentController);
};