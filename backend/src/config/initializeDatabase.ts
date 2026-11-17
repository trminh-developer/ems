import sequelize from './db';
import { ensureUserColumns } from './ensureUserColumns';
import { seedMockData } from '../utils/seedMockData';

let initialization: Promise<void> | undefined;

async function initialize() {
  // Serialize schema changes across serverless instances using a session lock.
  const connection = sequelize.getDialect() === 'postgres'
    ? await sequelize.connectionManager.getConnection({ type: 'write' }) as any : undefined;
  let locked = false;
  try {
    if (connection) {
      await connection.query("SELECT pg_advisory_lock(hashtext('heartconnect-schema-v1'))");
      locked = true;
    }
    await sequelize.authenticate();
    await ensureUserColumns();
    await sequelize.sync();
    await ensureUserColumns();
    await seedMockData();
  } finally {
    if (connection) {
      try {
        if (locked) await connection.query("SELECT pg_advisory_unlock(hashtext('heartconnect-schema-v1'))");
      } finally {
        await sequelize.connectionManager.releaseConnection(connection);
      }
    }
  }
}

export function initializeDatabase(): Promise<void> {
  if (!initialization) initialization = initialize().catch(error => {
    initialization = undefined;
    throw error;
  });
  return initialization;
}
