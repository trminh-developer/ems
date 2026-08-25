import { Match } from '../models';
import { matches } from '../data';

export const getMatches = async (): Promise<Match[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matches), 400);
  });
};

export const likeUser = async (userId: string): Promise<{ matched: boolean; match?: Match }> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ matched: false }), 300);
  });
};

export const dislikeUser = async (userId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const superLikeUser = async (userId: string): Promise<{ matched: boolean; match?: Match }> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ matched: false }), 400);
  });
};

export const unmatch = async (matchId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};
