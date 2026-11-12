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

export type BankTransferDetails = DirectBankTransfer | {
  mode?: 'sepay';
  environment: 'sandbox' | 'production';
};

export interface PaymentReceipt {
  reference: string;
  confirmedBy?: string;
  amount?: number;
}
