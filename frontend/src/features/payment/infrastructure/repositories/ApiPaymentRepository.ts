import { IPaymentRepository, CreatePaymentRequest, CreatePaymentResponse } from '../../application/ports/IPaymentRepository';
import { PaymentMethod } from '../../domain/entities/PaymentMethod';
import apiClient from '../../../../services/apiClient';

export class ApiPaymentRepository implements IPaymentRepository {
  async createPayment(provider: PaymentMethod, data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const res = await apiClient.post(`/payments/${provider}/create`, data);
    return res.data as CreatePaymentResponse;
  }
}