import { User } from './User';
import { Message } from './Message';

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message | null;
  unreadCount: number;
  updatedAt: string;
  isTyping?: boolean;
}
