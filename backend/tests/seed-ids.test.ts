import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { postgresSeedRows } from '../src/utils/seedIds';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const read = (name: string) => JSON.parse(fs.readFileSync(path.resolve(__dirname, '../Database', name + '.json'), 'utf8'));

test('PostgreSQL demo data uses valid UUIDs while preserving user identities and business plan IDs', () => {
  const users = read('users');
  assert.deepEqual(postgresSeedRows(users), users);
  const payments = postgresSeedRows(read('transactions'));
  assert.match(payments[0].id, uuid);
  assert.equal(payments[0].plan_id, read('transactions')[0].plan_id);
  assert.deepEqual(postgresSeedRows(payments), payments);
});

test('legacy seed IDs map consistently across interests, posts, likes and comments without mutating the source', () => {
  const interests = postgresSeedRows(read('interests'));
  const links = postgresSeedRows(read('user_interests'));
  for (const link of links) assert.ok(interests.some(interest => interest.id === link.interest_id));
  const posts = postgresSeedRows(read('statuses'));
  for (const row of [...postgresSeedRows(read('status_likes')), ...postgresSeedRows(read('status_comments'))]) {
    assert.ok(posts.some(post => post.id === row.status_id));
  }
  const source = [{ id: 'i1', user_id: null, name: 'Demo' }];
  const normalized = postgresSeedRows(source);
  assert.match(normalized[0].id, uuid);
  assert.equal(normalized[0].user_id, null);
  assert.equal(source[0].id, 'i1');
  assert.deepEqual(normalized, postgresSeedRows(source));
});
