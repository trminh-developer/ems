import { User } from './User';
import { Message } from './Message';

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isTyping?: boolean;
}
