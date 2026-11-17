import { createHash } from 'node:crypto';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const seedNamespace = Buffer.from('f8dbd186556f54a28f4502c861c154df', 'hex');

function stableSeedUuid(id: string): string {
  const bytes = createHash('sha1').update(seedNamespace).update(id).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Preserve existing UUIDs and map legacy demo IDs and their references consistently.
export function postgresSeedRows(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [
    key,
    typeof value === 'string' && (key === 'id' || key.endsWith('_id')) &&
      !['plan_id', 'premium_plan_id'].includes(key) && !uuidPattern.test(value)
      ? stableSeedUuid(value) : value,
  ])));
}
