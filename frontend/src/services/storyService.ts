import { Story } from '../models';

// MOCKED for now since MySQL backend doesn't implement stories yet
export const getFeedStories = async (): Promise<{ [userId: string]: Story[] }> => {
  return {};
};

export const createStory = async (
  userId: string, 
  mediaType: 'text' | 'image' | 'video', 
  mediaUrl?: string, 
  textContent?: string,
  backgroundColor?: string
): Promise<Story | null> => {
  
  return {
    id: Date.now().toString(),
    userId,
    mediaUrl,
    mediaType,
    textContent,
    backgroundColor: backgroundColor || '#000000',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
};
