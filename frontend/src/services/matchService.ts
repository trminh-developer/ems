import { Match } from '../models';
import apiClient from './apiClient';
import { mapMatch, mapUser } from '../utils/helpers';

// Keep the same request ID on a failed attempt so a retry cannot apply the action twice.
const pendingRequests = new Map<string, string>();
const swipe = async (userId: string, targetId: string, action: string) => {
  const key = `${userId}:${targetId}:${action}`;
  const requestId = pendingRequests.get(key) || crypto.randomUUID();
  pendingRequests.set(key, requestId);
  const res = await apiClient.post(`/matches/${action}`, { targetId, requestId });
  pendingRequests.delete(key);
  return res;
};

export const getMatches = async (userId: string): Promise<Match[]> => {
  const res = await apiClient.get('/matches/' + userId);
  return Array.isArray(res.data) ? res.data.map(mapMatch) : [];
};

export const likeUser = async (userId: string, targetId: string): Promise<{ matched: boolean; match?: Match }> => {
  const res = await swipe(userId, targetId, 'like');
  return {
    matched: Boolean(res.data?.matched),
    match: res.data?.match ? mapMatch({ ...res.data.match, ...(res.data.replayed ? { isNew: false, is_new: false } : {}) }) : undefined
  };
};

export const dislikeUser = async (userId: string, targetId: string): Promise<void> => {
  await swipe(userId, targetId, 'pass');
};

export const superLikeUser = async (userId: string, targetId: string): Promise<{ matched: boolean; match?: Match }> => {
  const res = await swipe(userId, targetId, 'superlike');
  return {
    matched: Boolean(res.data?.matched),
    match: res.data?.match ? mapMatch({ ...res.data.match, ...(res.data.replayed ? { isNew: false, is_new: false } : {}) }) : undefined
  };
};

export const unmatch = async (matchId: string): Promise<void> => {
  await apiClient.delete('/matches/' + matchId);
};

export const getWhoLikedMe = async (userId: string) => { 
  const res = await apiClient.get('/matches/who-liked-me/' + userId); 
  return res.data?.map(mapUser); 
};
export const getWhoILiked = async (userId: string) => { 
  const res = await apiClient.get('/matches/who-i-liked/' + userId); 
  return res.data?.map(mapUser); 
};

