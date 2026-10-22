export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  EMOJI = 'EMOJI',
  LOCATION = 'LOCATION'
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  SEEN = 'SEEN'
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageType;
  status: MessageStatus;
  isDeleted?: boolean;
  isRecalled?: boolean;
  deletedFor?: string[];
}
