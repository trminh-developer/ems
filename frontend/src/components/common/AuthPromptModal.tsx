import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from './index';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  title,
  description
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayTitle = title || t('auth_prompt.title');
  const displayDescription = description || t('auth_prompt.desc');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={displayTitle}>
      <div className="text-center py-3">
        <div className="mb-3">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger"
            style={{ width: '70px', height: '70px' }}
          >
            <i className="bi bi-heart-pulse-fill fs-1"></i>
          </div>
        </div>
        <p className="text-muted mb-4 px-2" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
          {displayDescription}
        </p>
        <div className="d-flex flex-column gap-2">
          <Button 
            className="btn-danger w-100 py-2 fw-semibold rounded-pill shadow-sm"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i> {t('auth_prompt.login')}
          </Button>
          <Button 
            className="btn-outline-secondary w-100 py-2 fw-medium rounded-pill"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
          >
            <i className="bi bi-person-plus me-2"></i> {t('auth_prompt.register')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthPromptModal;
