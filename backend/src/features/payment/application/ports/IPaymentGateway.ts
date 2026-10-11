export interface IPaymentGateway {
  createPaymentUrl(orderId: string, amount: number, description: string, ipAddr?: string): Promise<string>;
  verifyCallback(data: any): boolean;
  getOrderId(data: any): string;
  getResponseStatus(data: any): 'SUCCESS' | 'FAILED';
  getAmount(data: any): number;
}
