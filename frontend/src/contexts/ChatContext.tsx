import React, { createContext, useReducer, useCallback, ReactNode, useRef } from 'react';
import { Conversation, Message, MessageType } from '../models';
import { messageService } from '../services';

interface ChatState {
  conversations: Conversation[];
  activeConversation?: Conversation;
  messages: Message[];
  isLoading: boolean;
}

type ChatAction =
  | { type: 'LOAD_CONVERSATIONS_START' }
  | { type: 'LOAD_CONVERSATIONS_SUCCESS'; payload: Conversation[] }
  | { type: 'SELECT_CONVERSATION'; payload: { conversation: Conversation, messages: Message[] } }
  | { type: 'NEW_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string };

const initialState: ChatState = {
  conversations: [],
  messages: [],
  isLoading: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'LOAD_CONVERSATIONS_START':
      return { ...state, isLoading: true };
    case 'LOAD_CONVERSATIONS_SUCCESS':
      return { ...state, conversations: action.payload, isLoading: false };
    case 'SELECT_CONVERSATION':
      return { ...state, activeConversation: action.payload.conversation, messages: action.payload.messages };
    case 'NEW_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'DELETE_MESSAGE':
      return { ...state, messages: state.messages.filter(m => m.id !== action.payload) };
    default:
      return state;
  }
};

export interface ChatContextType extends ChatState {
  loadConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, type?: MessageType) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const conversationsRef = useRef<Conversation[]>([]);

  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) return JSON.parse(userStr).id;
    } catch (e) {}
    return '';
  };

  const loadConversations = useCallback(async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    dispatch({ type: 'LOAD_CONVERSATIONS_START' });
    const conversations = await messageService.getConversations(currentUserId);
    conversationsRef.current = conversations;
    dispatch({ type: 'LOAD_CONVERSATIONS_SUCCESS', payload: conversations });
    
    // Restore active conversation if web reloads
    const savedId = sessionStorage.getItem('activeConversationId');
    if (savedId) {
      const conversation = conversations.find(c => c.id === savedId);
      if (conversation) {
        const messages = await messageService.getMessages(savedId);
        dispatch({ type: 'SELECT_CONVERSATION', payload: { conversation, messages } });
      }
    }
  }, []);

  const selectConversation = async (conversationId: string) => {
    const conversation = conversationsRef.current.find(c => c.id === conversationId);
    if (conversation) {
      sessionStorage.setItem('activeConversationId', conversationId);
      const messages = await messageService.getMessages(conversationId);
      dispatch({ type: 'SELECT_CONVERSATION', payload: { conversation, messages } });
    }
  };

  const sendMessage = async (conversationId: string, content: string, type?: MessageType) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    const msg = await messageService.sendMessage(conversationId, currentUserId, content, type);
    dispatch({ type: 'NEW_MESSAGE', payload: msg });
  };

  const deleteMessage = async (messageId: string) => {
    await messageService.deleteMessage(messageId);
    dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
  };

  return (
    <ChatContext.Provider value={{ ...state, loadConversations, selectConversation, sendMessage, deleteMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
