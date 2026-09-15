import apiClient from './apiClient';

export const getStatuses = async (userId?: string) => {
  const res = await apiClient.get(`/feed/statuses/${userId || 'all'}`);
  return res.data;
};

export const createStatus = async (userId: string, content: string, mediaUrls?: string[]) => {
  const res = await apiClient.post('/feed/statuses', { userId, content, mediaUrls });
  return res.data;
};

export const toggleLike = async (statusId: string, userId: string, isLiked: boolean) => {
  const res = await apiClient.post('/feed/statuses/like', { statusId, userId, isLiked });
  return res.data;
};

export const getComments = async (statusId: string) => {
  const res = await apiClient.get(`/feed/comments/${statusId}`);
  return res.data;
};

export const addComment = async (statusId: string, userId: string, content: string) => {
  const res = await apiClient.post('/feed/comments', { statusId, userId, content });
  return res.data;
};
