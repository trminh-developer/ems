export interface SePayCheckout {
  environment: 'sandbox' | 'production';
  checkoutUrl: string;
  fields: { name: string; value: string | number }[];
}

export interface BankPayment {
  orderId: string;
  planId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  checkout: SePayCheckout | null;
  transfer: DirectBankTransfer | null;
}

export interface DirectBankTransfer {
  mode: 'direct';
  environment: 'production';
  bank: string;
  account: string;
  holder: string;
  description: string;
  qrImage: string;
  qrUrl: string;
  submission?: { reference: string; submittedAt: string };
}
