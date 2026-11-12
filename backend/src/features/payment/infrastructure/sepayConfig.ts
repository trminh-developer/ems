import dotenv from 'dotenv';
import path from 'node:path';
import { SePayPgClient, SepayConfig } from 'sepay-pg-node';

// Local merchant credentials are ignored by Git. Deployment environment variables take precedence.
dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local'), quiet: true });

export function getSePayConfig(): SepayConfig {
  const env = process.env.SEPAY_ENV || 'sandbox';
  if (env !== 'sandbox' && env !== 'production') throw Object.assign(new Error('SEPAY_ENV phải là sandbox hoặc production.'), { statusCode: 503 });
  const merchant_id = process.env.SEPAY_MERCHANT_ID?.trim();
  const secret_key = process.env.SEPAY_SECRET_KEY?.trim();
  if (!merchant_id || !secret_key) throw Object.assign(new Error('Chưa cấu hình tài khoản thanh toán SePay.'), { statusCode: 503 });
  if (env === 'production' && (/^SP-TEST-/i.test(merchant_id) || secret_key.startsWith('spsk_test_'))) {
    throw Object.assign(new Error('Chế độ production yêu cầu merchant và khóa SePay production.'), { statusCode: 503 });
  }
  return { env, merchant_id, secret_key };
}

export function createSePayClient() { return new SePayPgClient(getSePayConfig()); }
export function sePayAvailable() { try { getSePayConfig(); return true; } catch { return false; } }

export function paymentFrontendUrl() {
  return (process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://heartconnect.vercel.app' : 'http://localhost:5173')).replace(/\/$/, '');
}
