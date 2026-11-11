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
  isPremium?: boolean;
  premiumExpiresAt?: string;
  premiumPlanId?: string;
  appLogo?: string;
  nameChangedAt?: string;
  usernameChangedAt?: string;
  role?: 'ADMIN' | 'CENSOR' | 'USER';
  status?: 'ACTIVE' | 'BANNED' | 'DELETED';
  createdAt?: string;
  datingPreference?: DatingPreference;
  matchPercentage?: number | null;
  datingVisible?: boolean;
  locationUpdatedAt?: string;
  discoverySessionId?: string;
  compatibility?: {
    score: number | null;
    coldStart: boolean;
    reasons: string[];
    sharedInterests: string[];
    distanceKm: number | null;
  };

  // Backend raw snake_case fields
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  violation_count?: number;
  created_at?: string;
}
