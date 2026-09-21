import { Conversation, Message, MessageType } from '../models';
import apiClient from './apiClient';
import { mapConversation, mapMessage } from '../utils/helpers';

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const res = await apiClient.get('/messages/conversations/' + userId);
  return res.data?.map(mapConversation) || [];
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await apiClient.get('/messages/' + conversationId);
  return res.data?.map(mapMessage) || [];
};

export const sendMessage = async (conversationId: string, senderId: string, content: string, type: MessageType = MessageType.TEXT): Promise<Message> => {
  const res = await apiClient.post('/messages', { conversationId, senderId, content, type });
  return mapMessage(res.data);
};

export const markAsRead = async (conversationId: string, userId: string): Promise<void> => {
  await apiClient.put('/messages/' + conversationId + '/read', { userId });
};

export const deleteMessage = async (messageId: string) => { await apiClient.delete('/messages/' + messageId); };
