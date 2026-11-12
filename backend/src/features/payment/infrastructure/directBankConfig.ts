import { DirectBankTransfer } from '../domain/BankTransfer';
import { getPremiumPlan } from '../domain/PremiumPlans';

// These are the three QR links supplied by the receiving account owner.
const qrPlans: Record<string, { amount: number; description: string; file: string }> = {
  '1_month': { amount: 3000, description: 'Goi Premium 1 Month', file: '1-month' },
  '6_months': { amount: 6000, description: 'Goi Premium 6 Months', file: '6-months' },
  '12_months': { amount: 9000, description: 'Goi Premium 12 Months', file: '12-months' },
};

export function bankPaymentMode(): 'direct' | 'sepay' {
  const mode = process.env.BANK_PAYMENT_MODE || 'direct';
  if (mode !== 'direct' && mode !== 'sepay') throw Object.assign(new Error('BANK_PAYMENT_MODE không hợp lệ.'), { statusCode: 503 });
  return mode;
}

export function directBankDetails(planId: string, amount: number): DirectBankTransfer {
  const qr = qrPlans[planId];
  if (!qr || qr.amount !== amount || getPremiumPlan(planId).price !== amount) {
    throw Object.assign(new Error('Mã QR chưa khớp giá gói Premium. Vui lòng liên hệ quản trị viên.'), { statusCode: 503 });
  }
  return {
    mode: 'direct', environment: 'production', bank: 'BIDV', account: '96247MB07Y', holder: 'TRAN DUC MINH',
    description: qr.description, qrImage: `/payments/bidv-premium-${qr.file}.png`,
    qrUrl: `https://vietqr.app/img?bank=BIDV&acc=96247MB07Y&template=standee&amount=${amount}&des=${qr.description.replace(/ /g, '+')}&holder=TRAN%20DUC%20MINH&store=HeartConnect`,
  };
}

export function bankReference(value: unknown): string {
  const reference = typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : '';
  if (!/^[A-Z0-9][A-Z0-9._/-]{5,79}$/.test(reference)) {
    throw Object.assign(new Error('Nhập mã giao dịch ngân hàng từ 6–80 ký tự, gồm chữ, số, dấu chấm, gạch ngang hoặc gạch chéo.'), { statusCode: 400 });
  }
  return reference;
}
