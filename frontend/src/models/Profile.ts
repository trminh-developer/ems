import { User } from './User';

export interface Profile extends User {
  profileCompletion: number;
  totalLikes: number;
  totalMatches: number;
  joinedDate: string;
}
