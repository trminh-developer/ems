import { User, Gender, RelationshipGoal } from '../models';
import { supabase } from '../config/supabase';
import * as authService from './authService';

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

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
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
  const currentUser = authService.getCurrentUser();
  let query = supabase.from('users').select('*, user_interests(interest_id)');
  
  let currentUserInterests: string[] = [];
  
  if (currentUser) {
    const preferredGenders = currentUser.datingPreference?.preferredGender || [];
    
    // Thu thập interest IDs của user hiện tại
    if (currentUser.interests) {
      currentUserInterests = currentUser.interests.map((i: any) => i.id || i);
    }
    
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
  
  const users = data.map((dbUser: any) => {
    const user = mapDatabaseUserToModel(dbUser);
    
    // Tính toán Match Percentage dựa trên số interest trùng
    let matchPercentage = 60; // Base score
    if (dbUser.user_interests && currentUserInterests.length > 0) {
      const otherInterests = dbUser.user_interests.map((ui: any) => ui.interest_id);
      const commonCount = otherInterests.filter((id: string) => currentUserInterests.includes(id)).length;
      
      // Mỗi sở thích chung cộng thêm 8%, tối đa 99%
      matchPercentage = Math.min(99, matchPercentage + (commonCount * 8));
    } else {
      // Nếu không có dữ liệu, random từ 60-95%
      matchPercentage = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    }
    
    user.matchPercentage = matchPercentage;
    return user;
  });
  
  // Xáo trộn mảng ngẫu nhiên
  return users.sort(() => Math.random() - 0.5);
};

export const getNearbyUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*').limit(15);
  if (error) return [];
  return data.map(mapDatabaseUserToModel);
};

export const blockUser = async (userId: string): Promise<boolean> => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return false;
  
  const { error } = await supabase.from('user_blocks').insert([{
    blocker_id: currentUser.id,
    blocked_id: userId
  }]);
  
  return !error;
};

export const reportUser = async (userId: string, reason: string): Promise<boolean> => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return false;
  
  const { error } = await supabase.from('user_reports').insert([{
    reporter_id: currentUser.id,
    reported_id: userId,
    reason: reason
  }]);
  
  return !error;
};
