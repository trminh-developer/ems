import { Notification, NotificationType } from '../models/Notification';
import { users } from './users';

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: NotificationType.LIKE,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u1')!,
    message: 'Minh Anh đã thích hồ sơ của bạn',
    timestamp: '2023-10-07T08:00:00Z',
    isRead: false
  },
  {
    id: 'n2',
    type: NotificationType.MATCH,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u2')!,
    message: 'Bạn và Hương đã tương hợp!',
    timestamp: '2023-10-06T15:30:00Z',
    isRead: true,
    actionUrl: '/matches/m2'
  },
  {
    id: 'n3',
    type: NotificationType.MESSAGE,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u4')!,
    message: 'Mai đã gửi cho bạn một tin nhắn',
    timestamp: '2023-10-05T09:20:00Z',
    isRead: true,
    actionUrl: '/messages/c2'
  },
  {
    id: 'n4',
    type: NotificationType.PROFILE_VIEW,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u6')!,
    message: 'Lan Anh đã xem hồ sơ của bạn',
    timestamp: '2023-10-04T14:15:00Z',
    isRead: false
  },
  {
    id: 'n5',
    type: NotificationType.SUPER_LIKE,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u8')!,
    message: 'Quỳnh đã Super Like bạn!',
    timestamp: '2023-10-03T20:00:00Z',
    isRead: false
  },
  {
    id: 'n6',
    type: NotificationType.LIKE,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u10')!,
    message: 'Thu Hà đã thích hồ sơ của bạn',
    timestamp: '2023-10-02T11:45:00Z',
    isRead: true
  },
  {
    id: 'n7',
    type: NotificationType.MATCH,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u12')!,
    message: 'Bạn và Linh đã tương hợp!',
    timestamp: '2023-10-01T09:30:00Z',
    isRead: true,
    actionUrl: '/matches/m7'
  },
  {
    id: 'n8',
    type: NotificationType.PROFILE_VIEW,
    userId: 'current-user',
    fromUser: users.find(u => u.id === 'u7')!,
    message: 'Tuấn đã xem hồ sơ của bạn',
    timestamp: '2023-09-30T16:20:00Z',
    isRead: true
  }
];
