import { IPaymentRepository, CreatePaymentRequest, CreatePaymentResponse } from '../ports/IPaymentRepository';
import { PaymentMethod } from '../../domain/entities/PaymentMethod';
import { v4 as uuidv4 } from 'uuid';

export class CreatePaymentUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async execute(provider: PaymentMethod, planId: string, amount: number, title: string, userId?: string): Promise<string> {
    const orderId = 'ORD_' + uuidv4().substring(0, 8).toUpperCase();
    
    const requestData: CreatePaymentRequest = {
      orderId,
      amount,
      description: `Thanh toan goi Premium ${title}`,
      userId,
      planId
    };

    const response = await this.paymentRepository.createPayment(provider, requestData);
    
    if (!response.success || !response.paymentUrl) {
      throw new Error('Không thể tạo mã thanh toán');
    }
    
    return response.paymentUrl;
  }
}