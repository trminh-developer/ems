import { DataTypes } from 'sequelize';
import sequelize from './db';

// sync() alone does not add fields to existing databases.
export async function ensureUserColumns() {
  const query = sequelize.getQueryInterface();
  const columns = await query.describeTable('users');
  const additions = {
    premium_plan_id: DataTypes.STRING,
    app_logo: DataTypes.TEXT('long'),
    name_changed_at: DataTypes.DATE,
    username_changed_at: DataTypes.DATE,
  };
  for (const [name, type] of Object.entries(additions)) {
    if (!columns[name]) await query.addColumn('users', name, { type, allowNull: true });
  }
}
