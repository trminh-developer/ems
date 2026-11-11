"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRequest =
  exports.Report =
  exports.StatusComment =
  exports.StatusLike =
  exports.Status =
  exports.Notification =
  exports.Message =
  exports.Conversation =
  exports.Match =
  exports.UserInterest =
  exports.Interest =
  exports.UserPreference =
  exports.User =
  exports.sequelize =
    void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
exports.sequelize = db_1.default;
class User extends sequelize_1.Model {}
exports.User = User;
User.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    email: {
      type: sequelize_1.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    username: {
      type: sequelize_1.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    first_name: { type: sequelize_1.DataTypes.STRING },
    last_name: { type: sequelize_1.DataTypes.STRING },
    avatar: { type: sequelize_1.DataTypes.TEXT("long") },
    cover_photo: { type: sequelize_1.DataTypes.TEXT("long") },
    gender: { type: sequelize_1.DataTypes.STRING },
    date_of_birth: { type: sequelize_1.DataTypes.DATEONLY },
    city: { type: sequelize_1.DataTypes.STRING },
    country: { type: sequelize_1.DataTypes.STRING },
    latitude: { type: sequelize_1.DataTypes.FLOAT },
    longitude: { type: sequelize_1.DataTypes.FLOAT },
    bio: { type: sequelize_1.DataTypes.TEXT },
    profession: { type: sequelize_1.DataTypes.STRING },
    education: { type: sequelize_1.DataTypes.STRING },
    photos: { type: sequelize_1.DataTypes.JSON },
    relationship_goal: { type: sequelize_1.DataTypes.STRING },
    is_online: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    last_active: { type: sequelize_1.DataTypes.DATE },
    is_verified: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    role: {
      type: sequelize_1.DataTypes.ENUM("ADMIN", "CENSOR", "USER"),
      defaultValue: "USER",
    },
    status: {
      type: sequelize_1.DataTypes.ENUM("ACTIVE", "BANNED", "DELETED"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize: db_1.default,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
);
class UserPreference extends sequelize_1.Model {}
exports.UserPreference = UserPreference;
UserPreference.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    preferred_gender: { type: sequelize_1.DataTypes.JSON },
    age_min: { type: sequelize_1.DataTypes.INTEGER },
    age_max: { type: sequelize_1.DataTypes.INTEGER },
    max_distance: { type: sequelize_1.DataTypes.INTEGER },
  },
  {
    sequelize: db_1.default,
    modelName: "UserPreference",
    tableName: "user_preferences",
    timestamps: false,
  },
);
class Interest extends sequelize_1.Model {}
exports.Interest = Interest;
Interest.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    icon: { type: sequelize_1.DataTypes.STRING },
    category: { type: sequelize_1.DataTypes.STRING },
  },
  {
    sequelize: db_1.default,
    modelName: "Interest",
    tableName: "interests",
    timestamps: false,
  },
);
class UserInterest extends sequelize_1.Model {}
exports.UserInterest = UserInterest;
UserInterest.init(
  {
    user_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    interest_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
  },
  {
    sequelize: db_1.default,
    modelName: "UserInterest",
    tableName: "user_interests",
    timestamps: false,
  },
);
class Match extends sequelize_1.Model {}
exports.Match = Match;
Match.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    user1_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    user2_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    match_percentage: { type: sequelize_1.DataTypes.FLOAT },
    matched_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Match",
    tableName: "matches",
    timestamps: false,
  },
);
class Conversation extends sequelize_1.Model {}
exports.Conversation = Conversation;
Conversation.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    match_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    updated_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Conversation",
    tableName: "conversations",
    timestamps: false,
  },
);
class Message extends sequelize_1.Model {}
exports.Message = Message;
Message.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    conversation_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    sender_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    type: { type: sequelize_1.DataTypes.STRING, defaultValue: "text" },
    status: { type: sequelize_1.DataTypes.STRING, defaultValue: "sent" },
    created_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Message",
    tableName: "messages",
    timestamps: false,
  },
);
class Notification extends sequelize_1.Model {}
exports.Notification = Notification;
Notification.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    from_user_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    type: { type: sequelize_1.DataTypes.STRING },
    message: { type: sequelize_1.DataTypes.TEXT },
    is_read: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    created_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: false,
  },
);
class Status extends sequelize_1.Model {}
exports.Status = Status;
Status.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT },
    media_urls: { type: sequelize_1.DataTypes.JSON },
    created_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Status",
    tableName: "statuses",
    timestamps: false,
  },
);
class StatusLike extends sequelize_1.Model {}
exports.StatusLike = StatusLike;
StatusLike.init(
  {
    status_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    user_id: { type: sequelize_1.DataTypes.UUID, primaryKey: true },
    created_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "StatusLike",
    tableName: "status_likes",
    timestamps: false,
  },
);
class StatusComment extends sequelize_1.Model {}
exports.StatusComment = StatusComment;
StatusComment.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    status_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    created_at: {
      type: sequelize_1.DataTypes.DATE,
      defaultValue: sequelize_1.DataTypes.NOW,
    },
  },
  {
    sequelize: db_1.default,
    modelName: "StatusComment",
    tableName: "status_comments",
    timestamps: false,
  },
);
class VerificationRequest extends sequelize_1.Model {}
exports.VerificationRequest = VerificationRequest;
VerificationRequest.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    user_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    id_card_image: { type: sequelize_1.DataTypes.TEXT("long") },
    selfie_image: { type: sequelize_1.DataTypes.TEXT("long") },
    status: {
      type: sequelize_1.DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    sequelize: db_1.default,
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
class Report extends sequelize_1.Model {}
exports.Report = Report;
Report.init(
  {
    id: {
      type: sequelize_1.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    reporter_id: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    reported_user_id: { type: sequelize_1.DataTypes.UUID, allowNull: true }, // can be null if reporting a post
    reported_status_id: { type: sequelize_1.DataTypes.UUID, allowNull: true },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT },
    status: {
      type: sequelize_1.DataTypes.ENUM("PENDING", "RESOLVED", "DISMISSED"),
      defaultValue: "PENDING",
    },
  },
  {
    sequelize: db_1.default,
    modelName: "Report",
    tableName: "reports",
    timestamps: true,
  },
);
Report.belongsTo(User, { foreignKey: "reporter_id", as: "Reporter" });
Report.belongsTo(User, { foreignKey: "reported_user_id", as: "ReportedUser" });
Report.belongsTo(Status, {
  foreignKey: "reported_status_id",
  as: "ReportedStatus",
});
