import { Conversation, Message, MessageType } from '../models';
import apiClient from './apiClient';

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const res = await apiClient.get(`/messages/conversations/${userId}`);
  return res.data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await apiClient.get(`/messages/${conversationId}`);
  return res.data;
};

export const sendMessage = async (conversationId: string, senderId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> => {
  const res = await apiClient.post('/messages', { conversationId, senderId, content, type });
  return res.data;
};

export const markAsRead = async (conversationId: string, userId: string): Promise<void> => {
  await apiClient.put(`/messages/${conversationId}/read`, { userId });
};
