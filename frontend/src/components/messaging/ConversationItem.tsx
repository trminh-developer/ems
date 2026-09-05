import React from 'react';
import { Conversation } from '../../models';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatTime, truncateText } from '../../utils/helpers';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = React.memo(({ conversation, isActive, onClick, currentUserId }) => {
  // Find the other participant
  const otherUser = conversation.participants.find((p: any) => p.id !== currentUserId) || conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const isUnread = conversation.unreadCount > 0;

  if (!otherUser) {
    return null;
  }

  return (
    <div 
      className={`conversation-item p-3 d-flex align-items-center gap-3 cursor-pointer border-bottom ${isActive ? 'bg-light' : 'bg-white hover-bg-light'} ${isUnread ? 'fw-bold' : ''}`}
      onClick={onClick}
    >
      <Avatar src={otherUser.avatar || ''} alt={otherUser.firstName} size="md" isOnline={otherUser.isOnline} />
      
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex justify-content-between align-items-baseline mb-1">
          <h6 className="mb-0 text-truncate">{otherUser.firstName} {otherUser.lastName}</h6>
          {lastMessage && (
            <span className="small text-muted text-nowrap ms-2" style={{ fontSize: '0.75rem' }}>
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <p className={`mb-0 small text-truncate ${isUnread ? 'text-dark fw-semibold' : 'text-muted'}`}>
            {lastMessage ? (
              lastMessage.senderId === currentUserId ? `You: ${lastMessage.content}` : lastMessage.content
            ) : (
              <span className="fst-italic opacity-75">Start chatting...</span>
            )}
          </p>
          {isUnread && <Badge variant="primary" text={conversation.unreadCount.toString()} />}
        </div>
      </div>
    </div>
  );
});
