import { Match, User, Gender, RelationshipGoal } from '../models';
import { supabase } from '../config/supabase';
import { getCurrentUser } from './authService';

// Helper to map DB match to model
const mapDatabaseMatchToModel = (dbMatch: any, matchedUser: any): Match => {
  return {
    id: dbMatch.id,
    userId: dbMatch.user_id,
    matchedUserId: dbMatch.matched_user_id,
    matchedUser: {
      id: matchedUser.id,
      username: matchedUser.username,
      email: matchedUser.email,
      firstName: matchedUser.first_name,
      lastName: matchedUser.last_name,
      avatar: matchedUser.avatar,
      coverPhoto: matchedUser.cover_photo,
      gender: matchedUser.gender as Gender,
      dateOfBirth: matchedUser.date_of_birth,
      location: {
        city: matchedUser.city,
        country: matchedUser.country,
        latitude: matchedUser.latitude,
        longitude: matchedUser.longitude
      },
      bio: matchedUser.bio,
      profession: matchedUser.profession,
      education: matchedUser.education,
      photos: matchedUser.photos || [],
      interests: [],
      relationshipGoal: matchedUser.relationship_goal as RelationshipGoal,
      isOnline: matchedUser.is_online,
      lastActive: matchedUser.last_active,
      isVerified: matchedUser.is_verified
    },
    matchPercentage: dbMatch.match_percentage,
    matchedAt: dbMatch.matched_at,
    isNew: dbMatch.is_new,
    lastMessage: dbMatch.last_message
  };
};

export const getMatches = async (): Promise<Match[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      users!matches_matched_user_id_fkey (*)
    `)
    .eq('user_id', currentUser.id);

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return data.map((item: any) => mapDatabaseMatchToModel(item, item.users));
};

export const likeUser = async (userId: string): Promise<{ matched: boolean; match?: Match }> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { matched: false };

  // For this simple mock, any like has a 30% chance to match
  const isMatch = Math.random() > 0.7;
  
  if (isMatch) {
    // Check if user exists
    const { data: matchedUserData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError) return { matched: false };
    
    const newMatch = {
      user_id: currentUser.id,
      matched_user_id: userId,
      match_percentage: Math.floor(Math.random() * 30) + 70, // 70-99%
      is_new: true
    };
    
    const { data, error } = await supabase
      .from('matches')
      .insert([newMatch])
      .select()
      .single();
      
    if (!error && data) {
      // Create reciprocal match for the other user
      await supabase.from('matches').insert([{
        user_id: userId,
        matched_user_id: currentUser.id,
        match_percentage: newMatch.match_percentage,
        is_new: true
      }]);
      
      return { 
        matched: true, 
        match: mapDatabaseMatchToModel(data, matchedUserData)
      };
    }
  }
  
  return { matched: false };
};

export const dislikeUser = async (userId: string): Promise<void> => {
  // In a real app, you would log this interaction so they don't appear again
  return Promise.resolve();
};

export const superLikeUser = async (userId: string): Promise<{ matched: boolean; match?: Match }> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { matched: false };

  // Super like has higher chance
  const isMatch = Math.random() > 0.4;
  
  if (isMatch) {
    const { data: matchedUserData } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!matchedUserData) return { matched: false };
    
    const newMatch = {
      user_id: currentUser.id,
      matched_user_id: userId,
      match_percentage: Math.floor(Math.random() * 10) + 90, // 90-99%
      is_new: true
    };
    
    const { data, error } = await supabase.from('matches').insert([newMatch]).select().single();
      
    if (!error && data) {
      await supabase.from('matches').insert([{
        user_id: userId,
        matched_user_id: currentUser.id,
        match_percentage: newMatch.match_percentage,
        is_new: true
      }]);
      return { matched: true, match: mapDatabaseMatchToModel(data, matchedUserData) };
    }
  }
  
  return { matched: false };
};

export const unmatch = async (matchId: string): Promise<void> => {
  const { error } = await supabase.from('matches').delete().eq('id', matchId);
  if (error) {
    console.error('Error unmatching:', error);
  }
};
