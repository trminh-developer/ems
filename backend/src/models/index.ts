import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    avatar: { type: DataTypes.TEXT("long") },
    cover_photo: { type: DataTypes.TEXT("long") },
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
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: {
      type: DataTypes.ENUM("ADMIN", "CENSOR", "USER"),
      defaultValue: "USER",
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "BANNED", "DELETED"),
      defaultValue: "ACTIVE",
    },
    violation_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_premium: { type: DataTypes.BOOLEAN, defaultValue: false },
    premium_expires_at: { type: DataTypes.DATE },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true },
);

class UserPreference extends Model {}
UserPreference.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    preferred_gender: { type: DataTypes.JSON },
    age_min: { type: DataTypes.INTEGER },
    age_max: { type: DataTypes.INTEGER },
    max_distance: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: "UserPreference",
    tableName: "user_preferences",
    timestamps: false,
  },
);

class Interest extends Model {}
Interest.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Interest",
    tableName: "interests",
    timestamps: false,
  },
);

class UserInterest extends Model {}
UserInterest.init(
  {
    user_id: { type: DataTypes.UUID, primaryKey: true },
    interest_id: { type: DataTypes.UUID, primaryKey: true },
  },
  {
    sequelize,
    modelName: "UserInterest",
    tableName: "user_interests",
    timestamps: false,
  },
);

class Match extends Model {}
Match.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user1_id: { type: DataTypes.UUID, allowNull: false },
    user2_id: { type: DataTypes.UUID, allowNull: false },
    match_percentage: { type: DataTypes.FLOAT },
    matched_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, modelName: "Match", tableName: "matches", timestamps: false },
);

class Conversation extends Model {}
Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    match_id: { type: DataTypes.UUID, allowNull: false },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
    timestamps: false,
  },
);

class Message extends Model {}
Message.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    conversation_id: { type: DataTypes.UUID, allowNull: false },
    sender_id: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: "text" },
    status: { type: DataTypes.STRING, defaultValue: "sent" },
    is_recalled: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_for: { type: DataTypes.JSON, defaultValue: [] },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    timestamps: false,
    indexes: [
      { fields: ["conversation_id", "created_at"] },
      { fields: ["sender_id"] },
    ],
  },
);

class Notification extends Model {}
Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    from_user_id: { type: DataTypes.UUID, allowNull: true },
    type: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: false,
    indexes: [
      { fields: ["user_id", "created_at"] },
      { fields: ["user_id", "is_read"] },
    ],
  },
);

class Status extends Model {}
Status.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT },
    media_urls: { type: DataTypes.JSON },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Status",
    tableName: "statuses",
    timestamps: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["created_at"] },
      { fields: ["user_id", "created_at"] },
    ],
  },
);

class StatusLike extends Model {}
StatusLike.init(
  {
    status_id: { type: DataTypes.UUID, primaryKey: true },
    user_id: { type: DataTypes.UUID, primaryKey: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "StatusLike",
    tableName: "status_likes",
    timestamps: false,
  },
);

class StatusComment extends Model {}
StatusComment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "StatusComment",
    tableName: "status_comments",
    timestamps: false,
    indexes: [{ fields: ["status_id"] }, { fields: ["created_at"] }],
  },
);

class VerificationRequest extends Model {}
VerificationRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    id_card_image: { type: DataTypes.TEXT("long") },
    selfie_image: { type: DataTypes.TEXT("long") },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "VerificationRequest",
    tableName: "verification_requests",
    timestamps: true,
  },
);

User.hasMany(VerificationRequest, {
  foreignKey: "user_id",
  as: "verification_requests",
});
VerificationRequest.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Associations
User.hasOne(UserPreference, { foreignKey: "user_id" });
UserPreference.belongsTo(User, { foreignKey: "user_id" });

User.belongsToMany(Interest, {
  through: UserInterest,
  foreignKey: "user_id",
  as: "interests",
});
Interest.belongsToMany(User, {
  through: UserInterest,
  foreignKey: "interest_id",
  as: "users",
});

User.hasMany(Match, { foreignKey: "user1_id", as: "Matches1" });
User.hasMany(Match, { foreignKey: "user2_id", as: "Matches2" });
Match.belongsTo(User, { foreignKey: "user1_id", as: "User1" });
Match.belongsTo(User, { foreignKey: "user2_id", as: "User2" });

Match.hasOne(Conversation, { foreignKey: "match_id" });
Conversation.belongsTo(Match, { foreignKey: "match_id" });

Conversation.hasMany(Message, { foreignKey: "conversation_id" });
Message.belongsTo(Conversation, { foreignKey: "conversation_id" });

User.hasMany(Message, { foreignKey: "sender_id" });
Message.belongsTo(User, { foreignKey: "sender_id" });

User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "ReceivedNotifications",
});
Notification.belongsTo(User, { foreignKey: "user_id", as: "Receiver" });
User.hasMany(Notification, {
  foreignKey: "from_user_id",
  as: "SentNotifications",
});
Notification.belongsTo(User, { foreignKey: "from_user_id", as: "FromUser" });

User.hasMany(Status, { foreignKey: "user_id" });
Status.belongsTo(User, { foreignKey: "user_id" });

Status.hasMany(StatusLike, { foreignKey: "status_id" });
StatusLike.belongsTo(Status, { foreignKey: "status_id" });

User.hasMany(StatusLike, { foreignKey: "user_id" });
StatusLike.belongsTo(User, { foreignKey: "user_id" });

Status.hasMany(StatusComment, { foreignKey: "status_id" });
StatusComment.belongsTo(Status, { foreignKey: "status_id" });

User.hasMany(StatusComment, { foreignKey: "user_id" });
StatusComment.belongsTo(User, { foreignKey: "user_id" });

class Report extends Model {}
Report.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reporter_id: { type: DataTypes.UUID, allowNull: false },
    reported_user_id: { type: DataTypes.UUID, allowNull: true }, // can be null if reporting a post
    reported_status_id: { type: DataTypes.UUID, allowNull: true },
    reason: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("PENDING", "RESOLVED", "DISMISSED"),
      defaultValue: "PENDING",
    },
  },
  { sequelize, modelName: "Report", tableName: "reports", timestamps: true },
);

Report.belongsTo(User, { foreignKey: "reporter_id", as: "Reporter" });
Report.belongsTo(User, { foreignKey: "reported_user_id", as: "ReportedUser" });
Report.belongsTo(Status, {
  foreignKey: "reported_status_id",
  as: "ReportedStatus",
});

class Transaction extends Model {}
Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    plan_id: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "PENDING" },
    provider: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: false,
  },
);

class SystemSetting extends Model {}
SystemSetting.init(
  {
    key: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "SystemSetting",
    tableName: "system_settings",
    timestamps: true,
  },
);

export {
  sequelize,
  User,
  UserPreference,
  Interest,
  UserInterest,
  Match,
  Conversation,
  Message,
  Notification,
  Status,
  StatusLike,
  StatusComment,
  Report,
  VerificationRequest,
  Transaction,
  SystemSetting,
};
