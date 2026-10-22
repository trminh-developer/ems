import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../models';
import Avatar from '../common/Avatar';
import { useAlert } from '../../contexts/AlertContext';

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, onCall, onVideoCall }) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  return (
    <div className="chat-header p-3 bg-white border-bottom d-flex align-items-center gap-3 shadow-sm z-index-1">
      {onBack && (
        <button className="btn btn-link text-dark p-0 d-md-none" onClick={onBack}>
          <i className="bi bi-chevron-left fs-4"></i>
        </button>
      )}
      
      <Avatar src={user.avatar || ''} alt={user.firstName} size="md" isOnline={user.isOnline} />
      
      <div className="flex-grow-1">
        <h6 className="mb-0 fw-bold">{user.firstName} {user.lastName}</h6>
        {user.isOnline ? (
          <small className="text-success">{t('common.online')}</small>
        ) : (
          <small className="text-muted">{t('common.offline')}</small>
        )}
      </div>

      <button className="btn btn-light rounded-circle text-primary me-2 d-none d-sm-block" onClick={onCall || (() => showAlert('Call feature in development', 'info'))} title="Voice Call">
        <i className="bi bi-telephone-fill fs-5"></i>
      </button>

      <button className="btn btn-light rounded-circle text-primary me-2 d-none d-sm-block" onClick={onVideoCall || (() => showAlert('Video call in development', 'info'))} title="Video Call">
        <i className="bi bi-camera-video-fill fs-5"></i>
      </button>

      <div className="dropdown">
        <button className="btn btn-link text-muted p-2" type="button" data-bs-toggle="dropdown">
          <i className="bi bi-three-dots-vertical fs-5"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: '240px', borderRadius: '12px' }}>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert(t('messages.view_profile'), 'info')}><i className="bi bi-person-circle fs-5 me-3 text-secondary"></i> {t('messages.view_profile')}</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert(t('messages.mute_notifications'), 'success')}><i className="bi bi-bell-slash fs-5 me-3 text-secondary"></i> {t('messages.mute_notifications')}</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert(t('messages.theme'), 'info')}><i className="bi bi-palette fs-5 me-3 text-secondary"></i> {t('messages.theme')}</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert(t('messages.search_in_chat'), 'info')}><i className="bi bi-search fs-5 me-3 text-secondary"></i> {t('messages.search_in_chat')}</button></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert(t('messages.block_user'), 'warning')}><i className="bi bi-dash-circle fs-5 me-3 text-secondary"></i> {t('messages.block_user')}</button></li>
          <li><button className="dropdown-item py-2 text-danger fw-medium" onClick={() => showAlert(t('messages.report_user'), 'warning')}><i className="bi bi-exclamation-triangle fs-5 me-3"></i> {t('messages.report_user')}</button></li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
