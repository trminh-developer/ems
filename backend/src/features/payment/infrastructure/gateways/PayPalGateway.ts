import { IPaymentGateway } from '../../application/ports/IPaymentGateway';
import axios from 'axios';

export class PayPalGateway implements IPaymentGateway {
  private getBaseUrl() {
    return process.env.PAYMENT_MODE === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    
    if (!clientId || !secret) {
      throw new Error('PayPal credentials missing');
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    
    const response = await axios.post(`${this.getBaseUrl()}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  }

  async createPaymentUrl(orderId: string, amount: number, description: string, ipAddr: string): Promise<string> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Convert VND to USD (approximate, PayPal doesn't support VND natively)
    const usdAmount = (amount / 25000).toFixed(2);
    
    if (!process.env.PAYPAL_CLIENT_ID) {
      console.warn('PAYPAL_CLIENT_ID is missing! Using mock PayPal URL.');
      return `${frontendUrl}/payment/result?orderId=${orderId}&status=success`;
    }

    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.post(`${this.getBaseUrl()}/v2/checkout/orders`, {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId,
            description: description,
            amount: {
              currency_code: 'USD',
              value: usdAmount
            }
          }
        ],
        application_context: {
          return_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payment/paypal/return?orderId=${orderId}&status=success`,
          cancel_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payment/paypal/return?orderId=${orderId}&status=failed`,
          user_action: 'PAY_NOW'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Find the approve URL
      const approveLink = response.data.links.find((link: any) => link.rel === 'approve');
      return approveLink ? approveLink.href : `${frontendUrl}/payment/result?orderId=${orderId}&status=failed`;
    } catch (error: any) {
      console.error('PayPal error:', error?.response?.data || error);
      throw new Error('Lỗi tạo thanh toán PayPal');
    }
  }

  verifyCallback(data: any): boolean {
    return true; // Webhook verification can be added here
  }

  getOrderId(data: any): string {
    return data.orderId;
  }

  getResponseStatus(data: any): 'SUCCESS' | 'FAILED' {
    return data.status === 'success' ? 'SUCCESS' : 'FAILED';
  }

  getAmount(data: any): number {
    return 0;
  }
}
