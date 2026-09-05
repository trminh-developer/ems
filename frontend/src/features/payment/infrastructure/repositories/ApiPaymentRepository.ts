import { IPaymentRepository, CreatePaymentRequest, CreatePaymentResponse } from '../../application/ports/IPaymentRepository';
import { PaymentMethod } from '../../domain/entities/PaymentMethod';

export class ApiPaymentRepository implements IPaymentRepository {
  private API_URL = 'http://localhost:3000/api/payments';

  async createPayment(provider: PaymentMethod, data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const response = await fetch(`${this.API_URL}/${provider}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result as CreatePaymentResponse;
  }
}