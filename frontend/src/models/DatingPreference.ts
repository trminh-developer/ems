import { Gender } from './User';

export interface DatingPreference {
  preferredGender: Gender[];
  ageRange: { min: number; max: number };
  maxDistance: number; // km
  relationshipGoal: RelationshipGoal;
  acceptedGoals?: RelationshipGoal[];
  goalRequired?: boolean;
  distanceRequired?: boolean;
  distanceHalfLife?: number;
}

export enum RelationshipGoal {
  LONG_TERM = 'Mối quan hệ nghiêm túc',
  SHORT_TERM = 'Hẹn hò thử',
  FRIENDSHIP = 'Kết bạn',
  NOT_SURE = 'Chưa xác định'
}
