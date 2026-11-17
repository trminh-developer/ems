import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const staleDatabaseUrl = 'mysql://demo:unused@deleted.example.invalid:3306/defaultdb';

async function runProduction(source: string, environment: Record<string, string> = {}) {
  // A fresh process exercises the real startup configuration without sharing test-mode imports.
  return execFileAsync(process.execPath, ['--import', 'tsx', '--eval', source], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      USE_MOCK_DB: '',
      DATABASE_TYPE: '',
      DATABASE_URL: '',
      SQLITE_STORAGE: ':memory:',
      SENTRY_DSN: '',
      JWT_SECRET: 'production-mock-test',
      REFRESH_SECRET: 'production-mock-refresh-test',
      BANK_PAYMENT_MODE: 'direct',
      ...environment,
    },
    timeout: 45000,
    windowsHide: true,
  });
}

for (const [name, environment] of [
  ['USE_MOCK_DB overrides a deleted MySQL host', { USE_MOCK_DB: 'true', DATABASE_URL: staleDatabaseUrl }],
  ['DATABASE_TYPE=mock overrides a deleted MySQL host', { DATABASE_TYPE: 'mock', DATABASE_URL: staleDatabaseUrl }],
  ['an absent DATABASE_URL uses mock data', {}],
  ['a blank DATABASE_URL uses mock data', { DATABASE_URL: '   ' }],
  ['a SQLite URL uses mock data', { DATABASE_URL: 'sqlite::memory:' }],
] as const) {
  test('production: ' + name, async () => {
    await runProduction(`
      const assert = require('node:assert/strict');
      const sequelize = require('./src/config/db.ts').default;
      (async () => {
        try {
          assert.equal(sequelize.getDialect(), 'sqlite');
          assert.equal(sequelize.options.storage, ':memory:');
          await sequelize.authenticate();
        } finally {
          await sequelize.close();
        }
      })().catch(error => { console.error(error); process.exitCode = 1; });
    `, environment);
  });
}

test('production: an explicit MySQL URL remains available when mock mode is off', async () => {
  await runProduction(`
    const assert = require('node:assert/strict');
    const sequelize = require('./src/config/db.ts').default;
    assert.equal(sequelize.getDialect(), 'mysql');
    assert.equal(sequelize.config.host, 'deleted.example.invalid');
    assert.equal(sequelize.options.dialectOptions.ssl.require, true);
    sequelize.close().catch(error => { console.error(error); process.exitCode = 1; });
  `, { USE_MOCK_DB: 'false', DATABASE_URL: staleDatabaseUrl });
});

test('production mock startup seeds demo accounts and supports login and authenticated cookies without MySQL', async () => {
  const result = await runProduction(`
    const assert = require('node:assert/strict');
    const { once } = require('node:events');
    const { User, sequelize } = require('./src/models/index.ts');
    const { ensureUserColumns } = require('./src/config/ensureUserColumns.ts');
    const { seedMockData } = require('./src/utils/seedMockData.ts');
    const { createApp } = require('./src/app.ts');
    const demoUsers = require('./Database/users.json');
    let server;
    (async () => {
      try {
        assert.equal(sequelize.getDialect(), 'sqlite');
        await ensureUserColumns();
        await sequelize.sync();
        await ensureUserColumns();
        await seedMockData();
        assert.equal(await User.count(), demoUsers.length);
        const admin = demoUsers.find(user => user.role === 'ADMIN');
        assert.ok(admin);
        server = createApp().listen(0, '127.0.0.1');
        await once(server, 'listening');
        const origin = 'http://127.0.0.1:' + server.address().port;
        assert.equal((await fetch(origin + '/api/health')).status, 200);
        const login = await fetch(origin + '/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: admin.email, password: 'admin123' }),
        });
        const session = await login.json();
        assert.equal(login.status, 200, session.error);
        assert.equal(session.user.id, admin.id);
        assert.equal(session.user.password, undefined);
        const cookies = login.headers.getSetCookie();
        assert.equal(cookies.length, 2);
        assert.ok(cookies.every(cookie => cookie.includes('Secure') && cookie.includes('HttpOnly')));
        const me = await fetch(origin + '/api/auth/me', {
          headers: { Cookie: cookies.map(cookie => cookie.split(';')[0]).join('; ') },
        });
        assert.equal(me.status, 200);
        assert.equal((await me.json()).id, admin.id);
        await seedMockData();
        assert.equal(await User.count(), demoUsers.length);
        console.log('Production mock login and cookies verified.');
      } finally {
        if (server) await new Promise(resolve => server.close(resolve));
        await sequelize.close();
      }
    })().catch(error => { console.error(error); process.exitCode = 1; });
  `, { USE_MOCK_DB: 'true', DATABASE_URL: staleDatabaseUrl });
  assert.match(result.stdout, /Production mock login and cookies verified/);
});
