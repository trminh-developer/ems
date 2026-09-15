import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';
import { useAlert } from '../../contexts/AlertContext';

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack }) => {
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
          <small className="text-success">Online</small>
        ) : (
          <small className="text-muted">Offline</small>
        )}
      </div>

      <button className="btn btn-light rounded-circle text-primary me-2" onClick={() => showAlert('Tính năng lên lịch hẹn đang được phát triển!', 'info')} title="Lên lịch hẹn">
        <i className="bi bi-calendar-event fs-5"></i>
      </button>

      <div className="dropdown">
        <button className="btn btn-link text-muted p-2" type="button" data-bs-toggle="dropdown">
          <i className="bi bi-three-dots-vertical fs-5"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow">
          <li><button className="dropdown-item" onClick={() => showAlert('Đang xem hồ sơ...', 'info')}>Xem hồ sơ</button></li>
          <li><button className="dropdown-item text-danger" onClick={() => showAlert('Đã gửi báo cáo vi phạm!', 'warning')}>Báo cáo (Report)</button></li>
          <li><button className="dropdown-item" onClick={() => showAlert('Đã chặn người dùng này.', 'info')}>Chặn (Block)</button></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button className="dropdown-item text-muted" onClick={() => showAlert('Đã hủy tương hợp.', 'warning')}>Hủy tương hợp (Unmatch)</button></li>
        </ul>
      </div>
    </div>
  );
};
