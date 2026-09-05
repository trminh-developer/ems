import { ApiPaymentRepository } from '../infrastructure/repositories/ApiPaymentRepository';
import { CreatePaymentUseCase } from '../application/usecases/CreatePaymentUseCase';

// Khởi tạo các class (Singleton pattern cho DI ở React)
const paymentRepository = new ApiPaymentRepository();
const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);

// Tự tạo một Hook nhỏ để các component dễ dàng consume (Presentation -> UseCase)
export const usePaymentDi = () => {
  return {
    createPaymentUseCase
  };
};