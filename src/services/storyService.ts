import { supabase } from '../config/supabase';
import { Story } from '../models';

export const getFeedStories = async (): Promise<{ [userId: string]: Story[] }> => {
  // Chỉ lấy các story chưa hết hạn (trong vòng 24h)
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      users:user_id (id, username, first_name, last_name, avatar)
    `)
    .gte('expires_at', now)
    .order('created_at', { ascending: true }); // Cũ nhất trước để xem theo thứ tự
    
  if (error) {
    console.error('Error fetching stories:', error);
    return {};
  }
  
  // Nhóm theo userId
  const groupedStories: { [userId: string]: Story[] } = {};
  
  data.forEach((item: any) => {
    if (!groupedStories[item.user_id]) {
      groupedStories[item.user_id] = [];
    }
    
    groupedStories[item.user_id].push({
      id: item.id,
      userId: item.user_id,
      mediaUrl: item.media_url,
      mediaType: item.media_type,
      textContent: item.text_content,
      backgroundColor: item.background_color,
      createdAt: item.created_at,
      expiresAt: item.expires_at,
      user: item.users ? {
        id: item.users.id,
        username: item.users.username,
        firstName: item.users.first_name,
        lastName: item.users.last_name,
        avatar: item.users.avatar
      } : undefined
    });
  });
  
  return groupedStories;
};

export const createStory = async (
  userId: string, 
  mediaType: 'text' | 'image' | 'video', 
  mediaUrl?: string, 
  textContent?: string,
  backgroundColor?: string
): Promise<Story | null> => {
  
  const { data, error } = await supabase
    .from('stories')
    .insert([{
      user_id: userId,
      media_type: mediaType,
      media_url: mediaUrl || null,
      text_content: textContent || null,
      background_color: backgroundColor || '#000000'
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating story:', error);
    throw error;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    mediaUrl: data.media_url,
    mediaType: data.media_type,
    textContent: data.text_content,
    backgroundColor: data.background_color,
    createdAt: data.created_at,
    expiresAt: data.expires_at
  };
};
