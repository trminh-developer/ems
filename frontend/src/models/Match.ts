import { User } from './User';

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedUser: User;
  matchPercentage: number;
  matchedAt: string;
  isNew: boolean;
  lastMessage?: string;
}
