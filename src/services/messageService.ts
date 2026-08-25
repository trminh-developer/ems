import { Conversation, Message, MessageType, MessageStatus, User, Gender, RelationshipGoal } from '../models';
import { supabase } from '../config/supabase';
import { getCurrentUser } from './authService';

const mapDbUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  email: dbUser.email,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  avatar: dbUser.avatar,
  coverPhoto: dbUser.cover_photo,
  gender: dbUser.gender as Gender,
  dateOfBirth: dbUser.date_of_birth,
  location: { city: dbUser.city, country: dbUser.country },
  bio: dbUser.bio,
  interests: [],
  photos: dbUser.photos || [],
  relationshipGoal: dbUser.relationship_goal as RelationshipGoal,
  isOnline: dbUser.is_online,
  lastActive: dbUser.last_active
});

export const getConversations = async (): Promise<Conversation[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  // 1. Get conversation IDs for this user
  const { data: participations, error: partError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', currentUser.id);

  if (partError || !participations) return [];
  const convIds = participations.map(p => p.conversation_id);
  if (convIds.length === 0) return [];

  // 2. Fetch conversations with participants and last message
  const { data: convs, error } = await supabase
    .from('conversations')
    .select(`
      id, updated_at, unread_count,
      participants:users!conversation_participants(*),
      messages(*)
    `)
    .in('id', convIds);

  if (error || !convs) return [];

  return convs.map((c: any) => {
    // Sort messages to get the last one
    const sortedMessages = (c.messages || []).sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const lastMessage = sortedMessages[0] ? {
      id: sortedMessages[0].id,
      conversationId: sortedMessages[0].conversation_id,
      senderId: sortedMessages[0].sender_id,
      content: sortedMessages[0].content,
      timestamp: sortedMessages[0].timestamp,
      type: sortedMessages[0].type as MessageType,
      status: sortedMessages[0].status as MessageStatus,
    } : null;

    return {
      id: c.id,
      updatedAt: c.updated_at,
      unreadCount: c.unread_count,
      participants: c.participants.map(mapDbUser),
      lastMessage: lastMessage as Message
    };
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });

  if (error || !data) return [];

  return data.map((m: any) => ({
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    content: m.content,
    timestamp: m.timestamp,
    type: m.type as MessageType,
    status: m.status as MessageStatus,
    isDeleted: m.is_deleted
  }));
};

export const sendMessage = async (conversationId: string, content: string, type?: MessageType): Promise<Message> => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not logged in');

  const newMsg = {
    conversation_id: conversationId,
    sender_id: currentUser.id,
    content,
    type: type || 'text',
    status: 'sent'
  };

  const { data, error } = await supabase
    .from('messages')
    .insert([newMsg])
    .select()
    .single();

  if (error) throw error;
  
  // Update conversation updated_at
  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);

  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    content: data.content,
    timestamp: data.timestamp,
    type: data.type as MessageType,
    status: data.status as MessageStatus
  };
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  await supabase.from('messages').update({ is_deleted: true }).eq('id', messageId);
};

export const markAsRead = async (conversationId: string): Promise<void> => {
  await supabase.from('conversations').update({ unread_count: 0 }).eq('id', conversationId);
};
