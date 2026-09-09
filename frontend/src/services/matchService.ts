import { Match } from '../models';
import apiClient from './apiClient';

export const getMatches = async (userId: string): Promise<Match[]> => {
  const res = await apiClient.get(`/matches/${userId}`);
  return res.data;
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
  await apiClient.delete(`/matches/${matchId}`);
};
