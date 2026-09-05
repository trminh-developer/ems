export interface Story {
  id: string;
  userId: string;
  mediaUrl?: string;
  mediaType: 'text' | 'image' | 'video';
  textContent?: string;
  backgroundColor?: string;
  createdAt: string;
  expiresAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}
