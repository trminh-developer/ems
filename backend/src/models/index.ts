import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {}
User.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  cover_photo: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATEONLY },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  bio: { type: DataTypes.TEXT },
  profession: { type: DataTypes.STRING },
  education: { type: DataTypes.STRING },
  photos: { type: DataTypes.JSON },
  relationship_goal: { type: DataTypes.STRING },
  is_online: { type: DataTypes.BOOLEAN, defaultValue: false },
  last_active: { type: DataTypes.DATE },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize, modelName: 'User', tableName: 'users', timestamps: true });

class UserPreference extends Model {}
UserPreference.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  preferred_gender: { type: DataTypes.JSON },
  age_min: { type: DataTypes.INTEGER },
  age_max: { type: DataTypes.INTEGER },
  max_distance: { type: DataTypes.INTEGER }
}, { sequelize, modelName: 'UserPreference', tableName: 'user_preferences', timestamps: false });

class Interest extends Model {}
Interest.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING }
}, { sequelize, modelName: 'Interest', tableName: 'interests', timestamps: false });

class UserInterest extends Model {}
UserInterest.init({
  user_id: { type: DataTypes.UUID, primaryKey: true },
  interest_id: { type: DataTypes.UUID, primaryKey: true }
}, { sequelize, modelName: 'UserInterest', tableName: 'user_interests', timestamps: false });

class Match extends Model {}
Match.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user1_id: { type: DataTypes.UUID, allowNull: false },
  user2_id: { type: DataTypes.UUID, allowNull: false },
  match_percentage: { type: DataTypes.FLOAT },
  matched_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Match', tableName: 'matches', timestamps: false });

class Conversation extends Model {}
Conversation.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  match_id: { type: DataTypes.UUID, allowNull: false },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Conversation', tableName: 'conversations', timestamps: false });

class Message extends Model {}
Message.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  conversation_id: { type: DataTypes.UUID, allowNull: false },
  sender_id: { type: DataTypes.UUID, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'text' },
  status: { type: DataTypes.STRING, defaultValue: 'sent' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Message', tableName: 'messages', timestamps: false });

class Notification extends Model {}
Notification.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Notification', tableName: 'notifications', timestamps: false });

// Associations
User.hasOne(UserPreference, { foreignKey: 'user_id' });
UserPreference.belongsTo(User, { foreignKey: 'user_id' });

User.belongsToMany(Interest, { through: UserInterest, foreignKey: 'user_id' });
Interest.belongsToMany(User, { through: UserInterest, foreignKey: 'interest_id' });

User.hasMany(Match, { foreignKey: 'user1_id', as: 'Matches1' });
User.hasMany(Match, { foreignKey: 'user2_id', as: 'Matches2' });
Match.belongsTo(User, { foreignKey: 'user1_id', as: 'User1' });
Match.belongsTo(User, { foreignKey: 'user2_id', as: 'User2' });

Match.hasOne(Conversation, { foreignKey: 'match_id' });
Conversation.belongsTo(Match, { foreignKey: 'match_id' });

Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

User.hasMany(Message, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'sender_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

export {
  sequelize,
  User,
  UserPreference,
  Interest,
  UserInterest,
  Match,
  Conversation,
  Message,
  Notification
};
