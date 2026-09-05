import { User, Gender, RelationshipGoal } from '../models';
import { users } from '../data';

export interface SearchFilters {
  query?: string;
  gender?: Gender;
  ageRange?: { min: number; max: number };
  location?: string;
  interests?: string[];
  relationshipGoal?: RelationshipGoal;
  isOnline?: boolean;
}

export const search = async (filters: SearchFilters): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users), 500);
  });
};
