import { Match } from '../models/Match';
import { users } from './users';

export const matches: Match[] = [
  {
    id: 'm1',
    userId: 'current-user',
    matchedUserId: 'u1',
    matchedUser: users.find(u => u.id === 'u1')!,
    matchPercentage: 95,
    matchedAt: '2023-10-01T10:00:00Z',
    isNew: false,
    lastMessage: 'Chào bạn, rất vui được làm quen!'
  },
  {
    id: 'm2',
    userId: 'current-user',
    matchedUserId: 'u2',
    matchedUser: users.find(u => u.id === 'u2')!,
    matchPercentage: 88,
    matchedAt: '2023-10-02T15:30:00Z',
    isNew: true
  },
  {
    id: 'm3',
    userId: 'current-user',
    matchedUserId: 'u4',
    matchedUser: users.find(u => u.id === 'u4')!,
    matchPercentage: 92,
    matchedAt: '2023-10-03T09:15:00Z',
    isNew: false,
    lastMessage: 'Bạn có thích ăn phở không?'
  },
  {
    id: 'm4',
    userId: 'current-user',
    matchedUserId: 'u6',
    matchedUser: users.find(u => u.id === 'u6')!,
    matchPercentage: 78,
    matchedAt: '2023-10-04T20:00:00Z',
    isNew: true
  },
  {
    id: 'm5',
    userId: 'current-user',
    matchedUserId: 'u8',
    matchedUser: users.find(u => u.id === 'u8')!,
    matchPercentage: 85,
    matchedAt: '2023-10-05T12:00:00Z',
    isNew: false,
    lastMessage: 'Hôm nay thời tiết đẹp quá nhỉ.'
  },
  {
    id: 'm6',
    userId: 'current-user',
    matchedUserId: 'u10',
    matchedUser: users.find(u => u.id === 'u10')!,
    matchPercentage: 98,
    matchedAt: '2023-10-06T18:45:00Z',
    isNew: true
  }
];
