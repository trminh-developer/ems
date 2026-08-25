import { Conversation, Message, MessageType } from '../models';
import { conversations, messages } from '../data';

export const getConversations = async (): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(conversations), 400);
  });
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(messages.filter((m: Message) => m.conversationId === conversationId)), 300);
  });
};

export const sendMessage = async (conversationId: string, content: string, type?: MessageType): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(),
        conversationId,
        senderId: 'mock-user-id',
        content,
        timestamp: new Date().toISOString(),
        type: type || MessageType.TEXT,
        status: 0 as any, // SENT
      } as Message);
    }, 400);
  });
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};

export const markAsRead = async (conversationId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
};
