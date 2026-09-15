import { createClient } from '@supabase/supabase-js';
import sequelize from './config/db';
import { User, UserPreference, Interest, UserInterest, Match, Conversation, Message, Notification } from './models';

const supabase = createClient(
  'https://ibsklcxhjgvxcmqfkxvf.supabase.co',
  'sb_publishable_wSXPNAWBwEKZCO8fWKroWw_MHdDf2Kc'
);

async function migrateTable(tableName: any, SequelizeModel: any) {
  console.log(`Migrating ${tableName}...`);
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return;
  }
  if (data && data.length > 0) {
    // We need to handle JSON fields and column names
    await SequelizeModel.bulkCreate(data, { ignoreDuplicates: true });
    console.log(`Migrated ${data.length} rows for ${tableName}`);
  } else {
    console.log(`No data found for ${tableName}`);
  }
}

async function runMigration() {
  await sequelize.authenticate();
  console.log('Connected to MySQL!');
  await sequelize.sync({ force: true }); // Reset tables to be safe
  
  await migrateTable('users', User);
  await migrateTable('interests', Interest);
  await migrateTable('user_preferences', UserPreference);
  await migrateTable('user_interests', UserInterest);
  await migrateTable('matches', Match);
  await migrateTable('conversations', Conversation);
  await migrateTable('messages', Message);
  await migrateTable('notifications', Notification);

  console.log('Migration complete!');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('global error', err);
  process.exit(1);
});
