import { Interest, UserPreference } from '../../models';

// Sequelize annotates include objects while building aliases. Always return fresh objects.
export const profileIncludes = () => [
  { model: Interest, as: 'interests', through: { attributes: [] } },
  { model: UserPreference },
];

// Keep credentials, contact details, exact coordinates and private preferences out of dating responses.
export const publicProfileAttributes = [
  'id', 'username', 'first_name', 'last_name', 'avatar', 'cover_photo', 'gender', 'date_of_birth',
  'city', 'country', 'bio', 'profession', 'education', 'photos', 'relationship_goal',
  'is_online', 'last_active', 'is_verified', 'is_premium', 'premium_expires_at',
];

export function publicProfile(user: any) {
  const data = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return Object.fromEntries([...publicProfileAttributes, 'interests'].filter(key => data[key] !== undefined).map(key => [key, data[key]]));
}

export function ownProfile(user: any) {
  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete data.password;
  return data;
}
