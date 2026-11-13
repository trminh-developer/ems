import axios from 'axios';
import { createApp } from './app';
import sequelize from './config/db';
import { ensureUserColumns } from './config/ensureUserColumns';
import { seedMockData } from './utils/seedMockData';

let ready = false;
const app = createApp(() => ready);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}; waiting for database initialization.`);
});

async function start() {
  await ensureUserColumns();
  await sequelize.sync();
  await ensureUserColumns();
  await seedMockData();
  ready = true;
  console.log('Database initialized; API is ready.');

  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    setInterval(async () => {
      try { await axios.get(`${renderUrl}/api/health`, { timeout: 30000 }); }
      catch (error: any) { console.warn(`[KeepAlive] Ping failed: ${error.message}`); }
    }, 14 * 60 * 1000).unref();
  }
}

start().catch((error) => {
  console.error('Failed to initialize database:', error);
  server.close(() => { process.exitCode = 1; });
  void sequelize.close();
});
