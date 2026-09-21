require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'mysql',
  logging: false,
});

class Notification extends Model {}
Notification.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  from_user_id: { type: DataTypes.UUID, allowNull: true },
  type: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Notification', tableName: 'notifications', timestamps: false });

(async () => {
  const notifs = await Notification.findAll({ raw: true });
  console.log(notifs);
})();
