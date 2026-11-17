import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { Server } from 'node:http';
import { after, before, test } from 'node:test';

process.env.NODE_ENV = 'test';
process.env.USE_MOCK_DB = 'true';
process.env.SQLITE_STORAGE = ':memory:';
process.env.JWT_SECRET = 'hosted-api-test';
process.env.REFRESH_SECRET = 'hosted-refresh-test';
process.env.BANK_PAYMENT_MODE = 'direct';

let models: typeof import('../src/models');
let createHostedApp: typeof import('../src/hostedApp').createHostedApp;
const servers: Server[] = [];

before(async () => {
  models = await import('../src/models');
  assert.equal(models.sequelize.getDialect(), 'sqlite');
  assert.equal(models.sequelize.options.storage, ':memory:');
  ({ createHostedApp } = await import('../src/hostedApp'));
  await models.sequelize.sync();
});
after(async () => {
  for (const server of servers) await new Promise<void>(resolve => server.close(() => resolve()));
  if (models) await models.sequelize.close();
});
async function listen(initialize: () => Promise<void>) {
  const server = createHostedApp(initialize).listen(0, '127.0.0.1');
  servers.push(server);
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return `http://127.0.0.1:${address.port}`;
}

test('failed seeding rolls back demo accounts and can be retried', async () => {
  const { seedMockData } = await import('../src/utils/seedMockData');
  const upsert = models.Interest.upsert;
  models.Interest.upsert = async () => { throw new Error('seed rollback test'); };
  try {
    await assert.rejects(seedMockData(), /seed rollback test/);
    assert.equal(await models.User.count(), 0);
  } finally {
    models.Interest.upsert = upsert;
  }
});

test('concurrent hosted requests wait for one startup and login sees seeded data', async () => {
  const { initializeDatabase } = await import('../src/config/initializeDatabase');
  let release!: () => void, started!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const entered = new Promise<void>(resolve => { started = resolve; });
  let calls = 0;
  const origin = await listen(async () => {
    calls++;
    started();
    await gate;
    await initializeDatabase();
  });
  let responded = false;
  const first = fetch(origin + '/api/health').then(response => { responded = true; return response; });
  await entered;
  const second = fetch(origin + '/api/health');
  assert.equal(responded, false);
  release();
  for (const response of await Promise.all([first, second])) assert.equal(response.status, 200);
  assert.equal(calls, 1);
  const login = await fetch(origin + '/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@heartconnect.com', password: 'admin123' }),
  });
  assert.equal(login.status, 200);
  assert.equal((await login.json() as any).user.password, undefined);
});

test('hosted startup returns 503 on failure and retries on the next request', async () => {
  let calls = 0;
  const origin = await listen(async () => { if (++calls === 1) throw new Error('temporary startup test'); });
  assert.equal((await fetch(origin + '/api/health')).status, 503);
  assert.equal((await fetch(origin + '/api/health')).status, 200);
  assert.equal(calls, 2);
});
