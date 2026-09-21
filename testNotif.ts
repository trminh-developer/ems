import { Notification, User } from './backend/src/models';
import sequelize from './backend/src/config/db';

async function test() {
  await sequelize.sync();
  const n = await Notification.findAll({
    include: [{ model: User, as: 'FromUser' }]
  });
  console.log('Notifications length:', n.length);
}
test().catch(console.error).finally(() => process.exit());
