import { User } from './User';

export interface Status {
  id: string;
  userId: string;
  user?: User;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  hasLiked?: boolean; // For current user
}

export interface StatusLike {
  statusId: string;
  userId: string;
  createdAt: string;
}

export interface StatusComment {
  id: string;
  statusId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
}
