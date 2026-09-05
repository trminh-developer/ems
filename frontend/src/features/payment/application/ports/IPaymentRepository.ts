import { PaymentMethod } from '../../domain/entities/PaymentMethod';

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  description?: string;
  userId?: string;
  planId?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  provider: string;
  paymentUrl: string;
  transactionId: string;
}

export interface IPaymentRepository {
  createPayment(provider: PaymentMethod, data: CreatePaymentRequest): Promise<CreatePaymentResponse>;
}