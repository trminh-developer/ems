"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile =
  exports.searchUsers =
  exports.getNearbyUsers =
  exports.getRecommendedUsers =
  exports.getUserById =
  exports.getUserByUsername =
    void 0;
const models_1 = require("../../models");
const getUserByUsername = async (req, res) => {
  try {
    const { Interest } = require("../../models");
    const user = await models_1.User.findOne({
      where: { username: req.params.username },
      include: [
        { model: Interest, as: "interests", through: { attributes: [] } },
      ],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getUserByUsername = getUserByUsername;
const getUserById = async (req, res) => {
  try {
    const { Interest } = require("../../models");
    const user = await models_1.User.findByPk(req.params.id, {
      include: [
        { model: Interest, as: "interests", through: { attributes: [] } },
      ],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getUserById = getUserById;
const getRecommendedUsers = async (req, res) => {
  try {
    const users = await models_1.User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getRecommendedUsers = getRecommendedUsers;
const getNearbyUsers = async (req, res) => {
  try {
    const users = await models_1.User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getNearbyUsers = getNearbyUsers;
const searchUsers = async (req, res) => {
  try {
    const users = await models_1.User.findAll({ limit: 20 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.searchUsers = searchUsers;
const updateUserProfile = async (req, res) => {
  try {
    const user = await models_1.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Convert camelCase from frontend back to snake_case for database
    const updateData = {};
    const body = req.body;
    if (body.username !== undefined) updateData.username = body.username;
    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.coverPhoto !== undefined) updateData.cover_photo = body.coverPhoto;
    if (body.dateOfBirth !== undefined)
      updateData.date_of_birth = body.dateOfBirth;
    if (body.isVerified !== undefined) updateData.is_verified = body.isVerified;
    if (body.isOnline !== undefined) updateData.is_online = body.isOnline;
    if (body.password !== undefined) updateData.password = body.password;
    if (body.location?.city !== undefined) updateData.city = body.location.city;
    if (body.location?.country !== undefined)
      updateData.country = body.location.country;
    // Fields that match directly
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.profession !== undefined) updateData.profession = body.profession;
    if (body.education !== undefined) updateData.education = body.education;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.relationshipGoal !== undefined)
      updateData.relationship_goal = body.relationshipGoal;
    if (body.photos !== undefined) {
      if (typeof body.photos === "string") {
        try {
          updateData.photos = JSON.parse(body.photos);
        } catch {
          updateData.photos = [body.photos];
        }
      } else {
        updateData.photos = body.photos;
      }
    }
    await user.update(updateData);
    // Handle interests if provided
    if (body.interests && Array.isArray(body.interests)) {
      const UserInterest = require("../../models").UserInterest;
      // Remove old interests
      await UserInterest.destroy({ where: { user_id: user.id } });
      // Add new interests - filter out non-UUIDs (like newly created ones on frontend with Date.now())
      const validUuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const interestRecords = body.interests
        .filter((interest) => validUuidRegex.test(interest.id))
        .map((interest) => ({
          user_id: user.id,
          interest_id: interest.id,
        }));
      if (interestRecords.length > 0) {
        await UserInterest.bulkCreate(interestRecords);
      }
    }
    return res.json(user);
  } catch (e) {
    console.error("Update profile error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.updateUserProfile = updateUserProfile;
