import { User, Gender, RelationshipGoal } from '../models';
import { supabase } from '../config/supabase';

// Helper function to map snake_case DB fields to camelCase TS models
const mapDatabaseUserToModel = (dbUser: any): User => {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    avatar: dbUser.avatar,
    coverPhoto: dbUser.cover_photo,
    gender: dbUser.gender as Gender,
    dateOfBirth: dbUser.date_of_birth,
    location: {
      city: dbUser.city,
      country: dbUser.country,
      latitude: dbUser.latitude,
      longitude: dbUser.longitude
    },
    bio: dbUser.bio,
    profession: dbUser.profession,
    education: dbUser.education,
    photos: dbUser.photos || [],
    interests: [],
    relationshipGoal: dbUser.relationship_goal as RelationshipGoal,
    isOnline: dbUser.is_online,
    lastActive: dbUser.last_active,
    isVerified: dbUser.is_verified
  };
};

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data.map(mapDatabaseUserToModel);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapDatabaseUserToModel(data);
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const q = query.toLowerCase();
  // We use ilike for case-insensitive search in PostgreSQL
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
    
  if (error) {
    console.error('Error searching users:', error);
    return [];
  }
  return data.map(mapDatabaseUserToModel);
};

export const getRecommendedUsers = async (): Promise<User[]> => {
  // Lấy user hiện tại từ local storage để lọc sở thích
  const currentUserStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  let query = supabase.from('users').select('*');
  
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr);
    const preferredGenders = currentUser.datingPreference?.preferredGender || [];
    
    // Bỏ qua chính mình
    query = query.neq('id', currentUser.id);
    
    // Lọc theo giới tính mong muốn (nếu có set)
    if (preferredGenders.length > 0) {
      query = query.in('gender', preferredGenders);
    }
  }

  const { data, error } = await query.limit(20);
  
  if (error) {
    console.error('Error fetching recommended users:', error);
    return [];
  }
  
  // Xáo trộn mảng ngẫu nhiên
  const users = data.map(mapDatabaseUserToModel);
  return users.sort(() => Math.random() - 0.5);
};

export const getNearbyUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*').limit(15);
  if (error) return [];
  return data.map(mapDatabaseUserToModel);
};
