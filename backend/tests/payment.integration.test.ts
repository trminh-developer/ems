import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { once } from 'node:events';
import { createHmac } from 'node:crypto';
import type { Server } from 'node:http';
import express from 'express';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';
process.env.USE_MOCK_DB = 'true';
process.env.SQLITE_STORAGE = ':memory:';
process.env.JWT_SECRET = 'payment-integration-test-only';
process.env.SEPAY_ENV = 'sandbox';
process.env.SEPAY_MERCHANT_ID = 'SP-TEST-FIXTURE';
process.env.SEPAY_SECRET_KEY = 'spsk_test_fixture_only';
process.env.SEPAY_IPN_SECRET = 'fixture-ipn-secret';
process.env.FRONTEND_URL = 'https://frontend.example.test';
process.env.PAYMENT_MODE = 'sandbox';
process.env.BANK_PAYMENT_MODE = 'sepay';

let models: typeof import('../src/models');
let server: Server;
let baseUrl: string;
let buyer: any, other: any;
const orders = new Map<string, any>();

before(async () => {
  models = await import('../src/models');
  assert.equal(models.sequelize.options.storage, ':memory:');
  const [{ SePayGateway }, { BankGateway }, { SequelizeTransactionRepository }, { CreatePaymentUseCase }, { ProcessPaymentCallbackUseCase }, { PaymentController }, { setupPaymentRoutes }] = await Promise.all([
    import('../src/features/payment/infrastructure/gateways/SePayGateway'),
    import('../src/features/payment/infrastructure/gateways/BankGateway'),
    import('../src/features/payment/infrastructure/repositories/SequelizeTransactionRepository'),
    import('../src/features/payment/application/usecases/CreatePayment'),
    import('../src/features/payment/application/usecases/ProcessPaymentCallback'),
    import('../src/features/payment/presentation/controllers/PaymentController'),
    import('../src/features/payment/presentation/routes/PaymentRoutes'),
  ]);
  const gateway = new BankGateway(new SePayGateway(async invoice => {
    if (!orders.has(invoice)) throw { response: { status: 404 } };
    return orders.get(invoice);
  }));
  const repository = new SequelizeTransactionRepository();
  const controller = new PaymentController(new CreatePaymentUseCase(repository, { BANK: gateway }), new ProcessPaymentCallbackUseCase(repository, { BANK: gateway }));
  const app = express();
  app.use(express.json(), setupPaymentRoutes(controller));
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

beforeEach(async () => {
  process.env.BANK_PAYMENT_MODE = 'sepay';
  process.env.SEPAY_ENV = 'sandbox';
  process.env.SEPAY_MERCHANT_ID = 'SP-TEST-FIXTURE';
  process.env.SEPAY_SECRET_KEY = 'spsk_test_fixture_only';
  orders.clear();
  assert.equal(models.sequelize.options.storage, ':memory:');
  await models.sequelize.sync({ force: true });
  buyer = await models.User.create({ email: 'buyer@example.test', username: 'buyer', password: 'test-hash', last_active: new Date() });
  other = await models.User.create({ email: 'other@example.test', username: 'other', password: 'test-hash', last_active: new Date() });
});

after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  if (models) await models.sequelize.close();
});

async function request(path: string, actor: any = buyer, method = 'GET', body?: unknown, extraHeaders: Record<string, string> = {}) {
  const response = await fetch(baseUrl + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(actor ? { Authorization: 'Bearer ' + jwt.sign({ id: actor.id }, process.env.JWT_SECRET!) } : {}), ...extraHeaders },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: response.status, data };
}

async function create(planId = '1_month') {
  const result = await request('/bank/create', buyer, 'POST', { planId, amount: 1, userId: other.id, orderId: 'forged-order' });
  assert.equal(result.status, 200);
  return result.data.transactionId as string;
}

function paid(id: string, amount = 3000, reference = 'provider-' + id) {
  return {
    order_id: 'SEPAY-' + id, order_invoice_number: id, order_status: 'CAPTURED', order_amount: String(amount), order_currency: 'VND',
    transactions: [{ id: reference, payment_method: 'BANK_TRANSFER', transaction_type: 'PAYMENT', transaction_status: 'APPROVED', transaction_amount: String(amount), transaction_currency: 'VND' }],
  };
}
const notify = (id: string, secret = 'fixture-ipn-secret', type = 'ORDER_PAID') => request('/sepay/ipn', null, 'POST', {
  notification_type: type, order: { order_invoice_number: id, order_status: 'CAPTURED', order_amount: '1' },
}, { 'X-Secret-Key': secret });

test('all three prices are below 10k; creation ignores client price, identity and order ID; checkout is signed without exposing keys', async () => {
  const methods = await request('/methods', null);
  assert.equal(methods.data.environment, 'sandbox');
  assert.equal(methods.data.methods.bank, true);
  assert.deepEqual(methods.data.plans.map((plan: any) => plan.price), [3000, 6000, 9000]);
  for (const [plan, amount] of [['1_month', 3000], ['6_months', 6000], ['12_months', 9000]] as const) {
    const id = await create(plan);
    const tx: any = await models.Transaction.findByPk(id);
    assert.equal(tx.user_id, buyer.id);
    assert.equal(tx.amount, amount);
    assert.equal(tx.status, 'PENDING');
    assert.deepEqual(tx.payment_details, { environment: 'sandbox' });
    const result = await request('/bank/' + id);
    assert.equal(result.status, 200);
    const checkout = result.data.checkout;
    checkout.fields = Object.fromEntries(checkout.fields.map((field: any) => [field.name, field.value]));
    assert.equal(checkout.environment, 'sandbox');
    assert.equal(checkout.fields.order_amount, amount);
    assert.equal(checkout.fields.customer_id, buyer.id);
    assert.equal(checkout.fields.payment_method, 'BANK_TRANSFER');
    assert.equal(checkout.fields.order_invoice_number, id);
    const signed = Object.entries(checkout.fields).filter(([key]) => key !== 'signature').map(([key, value]) => key + '=' + value).join(',');
    assert.equal(checkout.fields.signature, createHmac('sha256', process.env.SEPAY_SECRET_KEY!).update(signed).digest('base64'));
    assert.ok(!JSON.stringify(result.data).includes(process.env.SEPAY_SECRET_KEY!));
    assert.ok(!JSON.stringify(result.data).includes(process.env.SEPAY_IPN_SECRET!));
    assert.match(checkout.fields.success_url, /^https:\/\/frontend\.example\.test\/payment\/result\?orderId=/);
  }
  assert.equal((await buyer.reload()).is_premium, false);
});

test('checkout and status require the buyer; forged success parameters and unauthenticated IPN never activate Premium', async () => {
  const id = await create();
  assert.equal((await request('/bank/create', null, 'POST', { planId: '1_month' })).status, 401);
  assert.equal((await request('/bank/' + id, other)).status, 404);
  assert.equal((await request('/' + id + '/status', other)).status, 404);
  assert.equal((await request('/' + id + '/status?status=SUCCESS&verifiedPaid=true')).data.status, 'PENDING');
  assert.equal((await notify(id, 'wrong-secret')).status, 401);
  assert.equal((await request('/bank/' + id + '/confirm', buyer, 'POST', { amount: 3000, reference: 'fake' })).status, 403);
  assert.equal((await buyer.reload()).is_premium, false);
});

test('authenticated IPN still queries SePay; a captured matching bank transaction activates once under concurrent retries', async () => {
  const id = await create();
  assert.equal((await notify(id)).status, 422);
  assert.equal((await buyer.reload()).is_premium, false);
  orders.set(id, paid(id));
  assert.equal((await notify(id)).status, 200);
  const expiry = (await buyer.reload()).premium_expires_at.toISOString();
  assert.equal(buyer.is_premium, true);
  assert.ok(new Date(expiry).getTime() > Date.now() + 27 * 86400000);
  const retries = await Promise.all([notify(id), notify(id)]);
  assert.ok(retries.every(result => result.status === 200));
  assert.equal((await buyer.reload()).premium_expires_at.toISOString(), expiry);
  const tx: any = await models.Transaction.findByPk(id);
  assert.equal(tx.provider_reference, 'sandbox:provider-' + id);
  assert.ok(tx.paid_at);
  assert.equal((await notify(id, 'fixture-ipn-secret', 'TRANSACTION_VOID')).status, 200);
  assert.equal((await models.Transaction.findByPk(id) as any).status, 'SUCCESS');
});

test('the result status endpoint can reconcile a paid order even when IPN was delayed', async () => {
  const id = await create('6_months');
  orders.set(id, paid(id, 6000));
  assert.equal((await request('/' + id + '/status')).data.status, 'SUCCESS');
  assert.equal((await buyer.reload()).premium_plan_id, '6_months');
});

test('wrong amount, currency, invoice, card payment or unapproved transaction cannot settle a bank order', async () => {
  const id = await create();
  const variants = [
    { ...paid(id), order_amount: '1' }, { ...paid(id), order_currency: 'USD' },
    { ...paid(id), order_invoice_number: 'different-order' },
    { ...paid(id), transactions: [{ ...paid(id).transactions[0], transaction_amount: '1' }] },
    { ...paid(id), transactions: [{ ...paid(id).transactions[0], payment_method: 'CARD' }] },
    { ...paid(id), transactions: [{ ...paid(id).transactions[0], transaction_status: 'PENDING' }] },
    { ...paid(id), transactions: [] },
  ];
  for (const invalid of variants) { orders.set(id, invalid); assert.equal((await notify(id)).status, 422); }
  assert.equal((await models.Transaction.findByPk(id) as any).status, 'PENDING');
  assert.equal((await buyer.reload()).is_premium, false);
});

test('a provider receipt cannot be reused for another order; uniqueness failure rolls Premium and status back together', async () => {
  const first = await create(), second = await create();
  orders.set(first, paid(first, 3000, 'same-receipt'));
  orders.set(second, paid(second, 3000, 'same-receipt'));
  assert.equal((await notify(first)).status, 200);
  const expiry = (await buyer.reload()).premium_expires_at.toISOString();
  assert.equal((await notify(second)).status, 422);
  assert.equal((await buyer.reload()).premium_expires_at.toISOString(), expiry);
  assert.equal((await models.Transaction.findByPk(second) as any).status, 'PENDING');
});

test('production rejects test merchant credentials and does not reconcile a sandbox order after switching environments', async () => {
  const id = await create();
  orders.set(id, paid(id));
  process.env.SEPAY_ENV = 'production';
  assert.equal((await request('/methods', null)).data.methods.bank, false);
  assert.equal((await request('/bank/create', buyer, 'POST', { planId: '1_month' })).status, 503);
  process.env.SEPAY_MERCHANT_ID = 'SP-LIVE-FIXTURE';
  process.env.SEPAY_SECRET_KEY = 'spsk_live_fixture_only';
  assert.equal((await notify(id)).status, 422);
  assert.equal((await request('/bank/' + id)).status, 409);
  assert.equal((await buyer.reload()).is_premium, false);
});

test('payment migration adds metadata and the receipt index while preserving old orders and is safe to repeat', async () => {
  const { DataTypes } = await import('sequelize');
  const query = models.sequelize.getQueryInterface();
  await query.dropTable('transactions');
  await query.createTable('transactions', {
    id: { type: DataTypes.STRING, primaryKey: true }, user_id: DataTypes.STRING,
    plan_id: DataTypes.STRING, amount: DataTypes.FLOAT, status: DataTypes.STRING,
    provider: DataTypes.STRING, created_at: DataTypes.DATE,
  });
  await query.bulkInsert('transactions', [{ id: 'legacy', user_id: buyer.id, plan_id: '1_month', amount: 99000, status: 'SUCCESS', provider: 'VNPAY', created_at: new Date() }]);
  const { ensurePaymentColumns } = await import('../src/config/ensureUserColumns');
  await ensurePaymentColumns(); await ensurePaymentColumns();
  const columns = await query.describeTable('transactions');
  assert.ok(columns.payment_details && columns.provider_reference && columns.paid_at && columns.confirmed_by);
  const old: any = await models.Transaction.findByPk('legacy');
  assert.equal(old.amount, 99000); assert.equal(old.status, 'SUCCESS');
  const indexes = await query.showIndex('transactions') as { name: string }[];
  assert.equal(indexes.filter(index => index.name === 'transactions_provider_reference_unique').length, 1);
});

test('direct QR needs no merchant keys and each plan uses the supplied BIDV image, amount and transfer content', async () => {
  delete process.env.BANK_PAYMENT_MODE;
  process.env.SEPAY_MERCHANT_ID = ''; process.env.SEPAY_SECRET_KEY = '';
  const methods = await request('/methods', null);
  assert.equal(methods.data.environment, 'production');
  assert.equal(methods.data.confirmationMode, 'manual');
  assert.equal(methods.data.methods.bank, true);
  for (const [plan, amount, description, image] of [
    ['1_month', 3000, 'Goi Premium 1 Month', '1-month'],
    ['6_months', 6000, 'Goi Premium 6 Months', '6-months'],
    ['12_months', 9000, 'Goi Premium 12 Months', '12-months'],
  ] as const) {
    const id = await create(plan);
    const details = await request('/bank/' + id);
    assert.equal(details.status, 200);
    assert.equal(details.data.checkout, null);
    assert.equal(details.data.amount, amount);
    const transfer = details.data.transfer;
    assert.equal(transfer.mode, 'direct');
    assert.equal(transfer.bank, 'BIDV');
    assert.equal(transfer.account, '96247MB07Y');
    assert.equal(transfer.holder, 'TRAN DUC MINH');
    assert.equal(transfer.description, description);
    assert.equal(transfer.qrImage, `/payments/bidv-premium-${image}.png`);
    const params = new URL(transfer.qrUrl).searchParams;
    assert.equal(params.get('amount'), String(amount));
    assert.equal(params.get('des'), description);
    assert.equal(params.get('acc'), transfer.account);
    assert.equal(params.get('bank'), transfer.bank);
    assert.equal(params.get('template'), 'standee');
    const status = await request('/' + id + '/status?status=SUCCESS');
    assert.equal(status.data.status, 'PENDING');
    assert.equal(status.data.confirmationMode, 'manual');
  }
  assert.equal((await buyer.reload()).is_premium, false);
});

test('a direct transfer claim is owned, validated and queued without activating Premium; only ADMIN can view or confirm', async () => {
  process.env.BANK_PAYMENT_MODE = 'direct';
  const id = await create();
  await other.update({ role: 'ADMIN' });
  assert.equal((await request('/bank/pending', other)).data.total, 0);
  assert.equal((await request('/bank/' + id + '/submit', null, 'POST', { reference: 'BIDV000123' })).status, 401);
  assert.equal((await request('/bank/' + id + '/submit', other, 'POST', { reference: 'BIDV000123' })).status, 404);
  assert.equal((await request('/bank/' + id + '/submit', buyer, 'POST', { reference: '<script>' })).status, 400);
  assert.equal((await request('/bank/' + id + '/submit', buyer, 'POST', { reference: ' bidv 000123 ' })).status, 200);
  const tx: any = await models.Transaction.findByPk(id);
  assert.equal(tx.status, 'PENDING');
  assert.equal(tx.payment_details.submission.reference, 'BIDV000123');
  const queue = await request('/bank/pending', other);
  assert.equal(queue.status, 200);
  assert.equal(queue.data.total, 1);
  assert.equal(queue.data.items[0].user.id, buyer.id);
  assert.equal((await request('/bank/pending', buyer)).status, 403);
  assert.equal((await request('/bank/pending', null)).status, 401);
  const receipt = { reference: 'BIDV000123', amount: 3000, verified: true };
  assert.equal((await request('/bank/' + id + '/confirm', buyer, 'POST', receipt)).status, 403);
  await other.update({ role: 'CENSOR' });
  assert.equal((await request('/bank/pending', other)).status, 403);
  assert.equal((await request('/bank/' + id + '/confirm', other, 'POST', receipt)).status, 403);
  orders.set(id, paid(id));
  assert.equal((await notify(id)).status, 422);
  assert.equal((await buyer.reload()).is_premium, false);
});

test('admin reconciliation checks amount and acknowledgement, records the reviewer and grants Premium exactly once', async () => {
  process.env.BANK_PAYMENT_MODE = 'direct';
  const id = await create();
  await other.update({ role: 'ADMIN' });
  await request('/bank/' + id + '/submit', buyer, 'POST', { reference: 'BIDV000124' });
  const path = '/bank/' + id + '/confirm';
  assert.equal((await request(path, other, 'POST', { reference: 'BIDV000124', amount: 1, verified: true })).status, 400);
  assert.equal((await request(path, other, 'POST', { reference: 'BIDV000124', amount: 3000, verified: false })).status, 400);
  assert.equal((await buyer.reload()).is_premium, false);
  const receipt = { reference: 'bidv000124', amount: 3000, verified: true };
  const results = await Promise.all([request(path, other, 'POST', receipt), request(path, other, 'POST', receipt)]);
  assert.deepEqual(results.map(result => result.status), [200, 200]);
  const expiry = (await buyer.reload()).premium_expires_at.toISOString();
  assert.equal(buyer.is_premium, true);
  assert.equal((await request(path, other, 'POST', receipt)).status, 200);
  assert.equal((await buyer.reload()).premium_expires_at.toISOString(), expiry);
  const tx: any = await models.Transaction.findByPk(id);
  assert.equal(tx.provider_reference, 'direct:BIDV:BIDV000124');
  assert.equal(tx.confirmed_by, other.id);
  assert.ok(tx.paid_at);
  assert.equal((await request('/bank/pending', other)).data.total, 0);
  assert.equal((await request('/' + id + '/status')).data.status, 'SUCCESS');
  assert.equal((await request(path, other, 'POST', { ...receipt, reference: 'BIDV000125' })).status, 409);
});

test('one bank receipt cannot pay for two direct orders; a rejected duplicate leaves the second order and entitlement unchanged', async () => {
  process.env.BANK_PAYMENT_MODE = 'direct';
  await other.update({ role: 'ADMIN' });
  const first = await create(), second = await create();
  const receipt = { reference: 'BIDV000126', amount: 3000, verified: true };
  assert.equal((await request('/bank/' + first + '/confirm', other, 'POST', receipt)).status, 200);
  const expiry = (await buyer.reload()).premium_expires_at.toISOString();
  assert.equal((await request('/bank/' + second + '/confirm', other, 'POST', receipt)).status, 409);
  assert.equal((await buyer.reload()).premium_expires_at.toISOString(), expiry);
  assert.equal((await models.Transaction.findByPk(second) as any).status, 'PENDING');
});
