import { Conversation } from '../models/Conversation';
import { users } from './users';
import { messages } from './messages';

export const conversations: Conversation[] = [
  {
    id: 'c1',
    participants: [users.find(u => u.id === 'current-user')!, users.find(u => u.id === 'u1')!],
    lastMessage: messages.find(m => m.id === 'msg1-4')!,
    unreadCount: 0,
    updatedAt: '2023-10-01T10:15:00Z',
    isTyping: false
  },
  {
    id: 'c2',
    participants: [users.find(u => u.id === 'current-user')!, users.find(u => u.id === 'u4')!],
    lastMessage: messages.find(m => m.id === 'msg2-2')!,
    unreadCount: 1,
    updatedAt: '2023-10-03T09:20:00Z',
    isTyping: true
  },
  {
    id: 'c3',
    participants: [users.find(u => u.id === 'current-user')!, users.find(u => u.id === 'u8')!],
    lastMessage: messages.find(m => m.id === 'msg3-3')!,
    unreadCount: 0,
    updatedAt: '2023-10-05T12:30:00Z',
    isTyping: false
  }
];
