import { FeedPost, Comment } from '../models';
import apiClient from './apiClient';

export const getFeeds = async (): Promise<FeedPost[]> => {
  const res = await apiClient.get('/feed');
  return res.data;
};

export const createPost = async (post: Partial<FeedPost>): Promise<FeedPost> => {
  const res = await apiClient.post('/feed', post);
  return res.data;
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  await apiClient.post(`/feed/${postId}/like`, { userId });
};

export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  await apiClient.delete(`/feed/${postId}/like`, { data: { userId } });
};

export const addComment = async (postId: string, userId: string, content: string): Promise<Comment> => {
  const res = await apiClient.post(`/feed/${postId}/comments`, { userId, content });
  return res.data;
};
