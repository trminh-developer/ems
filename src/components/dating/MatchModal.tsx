import React from 'react';
import { Match } from '../../models';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
// @ts-ignore
import { useAuth } from '../../hooks/useAuth';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  onSendMessage: () => void;
  onKeepDiscovering: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, match, onSendMessage, onKeepDiscovering }) => {
  const { user } = useAuth();
  if (!isOpen || !match || !user) return null;

  return (
    <div className="match-modal-overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-index-modal">
      <div className="match-modal-content text-center p-4">
        <h1 className="text-white fw-bold fst-italic mb-5 display-4" style={{ fontFamily: 'serif' }}>It's a Match!</h1>
        
        <p className="text-white fs-5 mb-5">You and {match.matchedUser.firstName} have liked each other.</p>

        <div className="d-flex justify-content-center align-items-center gap-4 mb-5">
          <div className="position-relative">
            <Avatar src={user.avatar || ''} alt="You" size="xl" className="border border-3 border-white shadow-lg" style={{ width: '120px', height: '120px' }} />
          </div>
          <div className="position-relative">
            <Avatar src={match.matchedUser.avatar || ''} alt={match.matchedUser.firstName} size="xl" className="border border-3 border-white shadow-lg" style={{ width: '120px', height: '120px' }} />
            <div className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center border border-2 border-white" style={{ width: '40px', height: '40px', right: '-10px', bottom: '-10px' }}>
              <i className="bi bi-heart-fill"></i>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 w-100 max-w-sm mx-auto" style={{ maxWidth: '300px' }}>
          <Button variant="primary" className="rounded-pill py-3 fw-bold" onClick={onSendMessage}>
            Send a Message
          </Button>
          <Button variant="outline" className="rounded-pill py-3 fw-bold text-white border-white hover-bg-light hover-text-dark" onClick={onKeepDiscovering}>
            Keep Discovering
          </Button>
        </div>
      </div>
    </div>
  );
};
