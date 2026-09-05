import { Message, MessageType, MessageStatus } from '../models/Message';

export const messages: Message[] = [
  // Conversation c1 (current-user and u1)
  {
    id: 'msg1-1',
    conversationId: 'c1',
    senderId: 'current-user',
    content: 'Chào Minh Anh, rất vui được làm quen!',
    timestamp: '2023-10-01T10:05:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg1-2',
    conversationId: 'c1',
    senderId: 'u1',
    content: 'Chào Minh, mình cũng rất vui. Bạn cũng thích du lịch à?',
    timestamp: '2023-10-01T10:07:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg1-3',
    conversationId: 'c1',
    senderId: 'current-user',
    content: 'Đúng rồi, mình hay đi phượt cuối tuần.',
    timestamp: '2023-10-01T10:10:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg1-4',
    conversationId: 'c1',
    senderId: 'u1',
    content: 'Thế hôm nào đi chung nhé!',
    timestamp: '2023-10-01T10:15:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },

  // Conversation c2 (current-user and u4)
  {
    id: 'msg2-1',
    conversationId: 'c2',
    senderId: 'current-user',
    content: 'Mai ở Huế chắc hay ăn bánh bèo nhỉ?',
    timestamp: '2023-10-03T09:16:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg2-2',
    conversationId: 'c2',
    senderId: 'u4',
    content: 'Đúng rồi bạn, ngon lắm luôn. Bạn có thích ăn phở không?',
    timestamp: '2023-10-03T09:20:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.DELIVERED
  },

  // Conversation c3 (current-user and u8)
  {
    id: 'msg3-1',
    conversationId: 'c3',
    senderId: 'current-user',
    content: 'Chào Quỳnh, biển Nha Trang mùa này đẹp không?',
    timestamp: '2023-10-05T12:05:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg3-2',
    conversationId: 'c3',
    senderId: 'u8',
    content: 'Đẹp lắm Minh ơi. Nắng vàng biển xanh.',
    timestamp: '2023-10-05T12:15:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  },
  {
    id: 'msg3-3',
    conversationId: 'c3',
    senderId: 'current-user',
    content: 'Hôm nay thời tiết đẹp quá nhỉ.',
    timestamp: '2023-10-05T12:30:00Z',
    type: MessageType.TEXT,
    status: MessageStatus.SEEN
  }
];
