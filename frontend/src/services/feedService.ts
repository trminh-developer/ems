import apiClient from './apiClient';

export const getStatuses = async (userId?: string) => {
  const url = userId ? `/feed/${userId}` : '/feed/all';
  const res = await apiClient.get(url);
  return res.data;
};

export const createStatus = async (userId: string, content: string, mediaUrls?: string[]) => {
  const res = await apiClient.post('/feed', { userId, content, mediaUrls });
  return res.data;
};

export const toggleLike = async (statusId: string, userId: string, isLiked: boolean) => {
  const res = await apiClient.post('/feed/like', { statusId, userId, isLiked });
  return res.data;
};

export const getComments = async (statusId: string) => {
  const res = await apiClient.get(`/feed/${statusId}/comments`);
  return res.data;
};

export const addComment = async (statusId: string, userId: string, content: string) => {
  const res = await apiClient.post('/feed/comment', { statusId, userId, content });
  return res.data;
};
