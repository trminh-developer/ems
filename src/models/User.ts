import { UserLocation } from './Location';
import { Interest } from './Interest';
import { DatingPreference, RelationshipGoal } from './DatingPreference';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  coverPhoto: string;
  gender: Gender;
  dateOfBirth: string;
  location: UserLocation;
  bio: string;
  profession?: string;
  education?: string;
  interests: Interest[];
  photos: string[];
  relationshipGoal: RelationshipGoal;
  isOnline: boolean;
  lastActive: string;
  isVerified?: boolean;
  datingPreference?: DatingPreference;
}
