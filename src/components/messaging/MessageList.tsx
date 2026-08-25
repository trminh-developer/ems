import React, { useEffect, useRef } from 'react';
import { Message } from '../../models';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list flex-grow-1 overflow-auto p-3 p-md-4 bg-light d-flex flex-column gap-3">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          isSent={message.senderId === currentUserId} 
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
