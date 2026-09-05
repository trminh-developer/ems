import React from 'react';
import { Conversation } from '../../models';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conversation: Conversation) => void;
  currentUserId: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeId, onSelect, currentUserId }) => {
  return (
    <div className="conversation-list overflow-auto h-100 bg-white">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-muted mt-5">
          <i className="bi bi-chat-dots fs-1 mb-3 d-block opacity-50"></i>
          <p>No conversations yet. Start swiping to match and chat!</p>
        </div>
      ) : (
        <ul className="list-unstyled mb-0">
          {conversations.map(conv => (
            <li key={conv.id}>
              <ConversationItem 
                conversation={conv} 
                isActive={conv.id === activeId} 
                onClick={() => onSelect(conv)} 
                currentUserId={currentUserId} 
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
