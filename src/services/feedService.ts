import { supabase } from '../config/supabase';
import { Status, StatusComment, User } from '../models';
import { userService } from './index';

// Fetch statuses with their authors
export const getStatuses = async (userId?: string): Promise<Status[]> => {
  let query = supabase
    .from('statuses')
    .select(`
      *,
      users:user_id (id, username, first_name, last_name, avatar, is_online)
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching statuses:', error);
    return [];
  }

  // Check if current user has liked
  const currentUserId = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}').id;
  
  let userLikes: string[] = [];
  if (currentUserId) {
    const { data: likes } = await supabase
      .from('status_likes')
      .select('status_id')
      .eq('user_id', currentUserId);
    userLikes = likes?.map(l => l.status_id) || [];
  }

  return data.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    content: item.content,
    mediaUrls: item.media_urls || [],
    createdAt: item.created_at,
    likesCount: item.likes_count,
    commentsCount: item.comments_count,
    hasLiked: userLikes.includes(item.id),
    user: item.users ? {
      id: item.users.id,
      username: item.users.username,
      firstName: item.users.first_name,
      lastName: item.users.last_name,
      avatar: item.users.avatar,
      isOnline: item.users.is_online
    } : undefined
  }));
};

export const createStatus = async (userId: string, content: string, mediaUrls: string[]): Promise<Status | null> => {
  const { data, error } = await supabase
    .from('statuses')
    .insert([{ user_id: userId, content, media_urls: mediaUrls }])
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating status:', error);
    throw new Error(error?.message || 'Không thể tạo bài viết');
  }

  // Fetch full user data for the response
  const user = await userService.getUserById(userId);

  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    mediaUrls: data.media_urls || [],
    createdAt: data.created_at,
    likesCount: data.likes_count,
    commentsCount: data.comments_count,
    hasLiked: false,
    user: user || undefined
  };
};

export const toggleLike = async (statusId: string, userId: string, isCurrentlyLiked: boolean): Promise<boolean> => {
  if (isCurrentlyLiked) {
    // Unlike
    const { error } = await supabase
      .from('status_likes')
      .delete()
      .match({ status_id: statusId, user_id: userId });
      
    if (error) return false;
    
    // Decrement counter
    await supabase.rpc('decrement_status_likes', { row_id: statusId });
    return true;
  } else {
    // Like
    const { error } = await supabase
      .from('status_likes')
      .insert([{ status_id: statusId, user_id: userId }]);
      
    if (error) return false;
    
    // Increment counter
    await supabase.rpc('increment_status_likes', { row_id: statusId });
    return true;
  }
};

export const addComment = async (statusId: string, userId: string, content: string): Promise<StatusComment | null> => {
  const { data, error } = await supabase
    .from('status_comments')
    .insert([{ status_id: statusId, user_id: userId, content }])
    .select()
    .single();

  if (error || !data) return null;

  // Increment counter
  await supabase.rpc('increment_status_comments', { row_id: statusId });

  const user = await userService.getUserById(userId);

  return {
    id: data.id,
    statusId: data.status_id,
    userId: data.user_id,
    content: data.content,
    createdAt: data.created_at,
    user: user || undefined
  };
};

export const getComments = async (statusId: string): Promise<StatusComment[]> => {
  const { data, error } = await supabase
    .from('status_comments')
    .select(`
      *,
      users:user_id (id, username, first_name, last_name, avatar)
    `)
    .eq('status_id', statusId)
    .order('created_at', { ascending: true });

  if (error) return [];

  return data.map((item: any) => ({
    id: item.id,
    statusId: item.status_id,
    userId: item.user_id,
    content: item.content,
    createdAt: item.created_at,
    user: item.users ? {
      id: item.users.id,
      username: item.users.username,
      firstName: item.users.first_name,
      lastName: item.users.last_name,
      avatar: item.users.avatar
    } : undefined
  }));
};
