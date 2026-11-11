import { Transaction } from 'sequelize';
import { PairState, sequelize } from '../../models';

let sqliteQueue = Promise.resolve();

export async function datingTransaction<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
  const run = async () => {
    for (let attempt = 0; ; attempt++) {
      try { return await sequelize.transaction(work); }
      catch (error: any) {
        const code = error.original?.code;
        if (attempt >= 2 || !['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT', 'SQLITE_BUSY'].includes(code)) throw error;
        await new Promise(resolve => setTimeout(resolve, 20 * (attempt + 1)));
      }
    }
  };
  // SQLite has a single writer; an in-process queue also supports the in-memory test DB.
  if (sequelize.getDialect() !== 'sqlite') return run();
  const result = sqliteQueue.then(run);
  sqliteQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function lockPair(a: string, b: string, transaction: Transaction) {
  const [user_low_id, user_high_id] = [a, b].sort();
  const where = { user_low_id, user_high_id };
  await PairState.findOrCreate({ where, defaults: { ...where, state: 'open' }, transaction });
  return (await PairState.findOne({ where, transaction, lock: transaction.LOCK.UPDATE }))!;
}
