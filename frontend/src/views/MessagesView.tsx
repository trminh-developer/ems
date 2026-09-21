import React, { useState } from 'react';
import { ConversationList, ChatHeader, MessageList, MessageInput, CallModal } from '../components/messaging';
import { EmptyState, Loading } from '../components/common';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';

const MessagesView = () => {
  const { conversations, activeConversation, messages, isLoading, selectConversation, sendMessage } = useChat();
  const { user } = useAuth();
  const [showList, setShowList] = useState(true);
  
  // Call modal states
  const [showCallModal, setShowCallModal] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  if (isLoading) return <Loading text="Đang tải tin nhắn..." />;

  const handleSelectConversation = (conversation: any) => {
    selectConversation(conversation.id);
    if (window.innerWidth < 768) {
      setShowList(false);
    }
  };

  React.useEffect(() => {
    let interval: any;
    if (activeConversation) {
      interval = setInterval(() => {
        selectConversation(activeConversation.id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeConversation, selectConversation]);

  const activePartner = activeConversation?.participants?.find((p: any) => p.id !== user?.id) || activeConversation?.participants?.[0];

  return (
    <div className="messages-layout h-100 fade-in hc-card overflow-hidden">
      <div className="d-flex h-100 w-100">
        <div className={`messages-sidebar border-end h-100 d-flex flex-column ${!showList ? 'd-none d-md-flex' : ''}`}>
          {conversations && conversations.length > 0 ? (
            <ConversationList 
              conversations={conversations} 
              activeId={activeConversation?.id} 
              onSelect={handleSelectConversation} 
              currentUserId={user?.id || ''}
            />
          ) : (
            <div className="p-4 flex-grow-1 d-flex align-items-center justify-content-center">
              <EmptyState icon="bi bi-chat" title="No conversations yet 💬" description="" />
            </div>
          )}
        </div>

        <div className={`h-100 d-flex flex-column flex-grow-1 ${showList ? 'd-none d-md-flex' : ''}`}>
          {activeConversation && activePartner ? (
            <>
              <ChatHeader 
                user={activePartner} 
                onBack={() => setShowList(true)}
                onCall={() => { setIsVideoCall(false); setShowCallModal(true); }}
                onVideoCall={() => { setIsVideoCall(true); setShowCallModal(true); }}
              />
              <MessageList messages={messages} currentUserId={user?.id || ''} />
              <MessageInput onSend={(content) => {
                if (content.startsWith('[IMAGE]')) {
                  sendMessage(activeConversation.id, content.substring(7), 'image' as any);
                } else {
                  sendMessage(activeConversation.id, content);
                }
              }} />
            </>
          ) : (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <EmptyState icon="bi bi-chat-dots" title="Chọn một cuộc trò chuyện để bắt đầu" description="" />
            </div>
          )}
        </div>
      </div>
      
      {showCallModal && activePartner && (
        <CallModal 
          user={activePartner} 
          isVideo={isVideoCall} 
          onClose={() => setShowCallModal(false)} 
        />
      )}
    </div>
  );
};

export default MessagesView;
