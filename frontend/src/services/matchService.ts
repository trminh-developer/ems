import { Match } from '../models';
import apiClient from './apiClient';
import { mapUser } from '../utils/helpers';

export const getMatches = async (userId: string): Promise<Match[]> => {
  const res = await apiClient.get('/matches/' + userId);
  return res.data; // Matches don't need mapUser yet unless we map nested User
};

export const likeUser = async (userId: string, targetId: string): Promise<{ matched: boolean; match?: Match }> => {
  const res = await apiClient.post('/matches/like', { userId, targetId });
  return res.data;
};

export const dislikeUser = async (userId: string, targetId: string): Promise<void> => {
  await apiClient.post('/matches/pass', { userId, targetId });
};

export const superLikeUser = async (userId: string, targetId: string): Promise<{ matched: boolean; match?: Match }> => {
  const res = await apiClient.post('/matches/superlike', { userId, targetId });
  return res.data;
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

