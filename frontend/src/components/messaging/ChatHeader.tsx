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

      <button className="btn btn-light rounded-circle text-primary me-2 d-none d-sm-block" onClick={() => showAlert('Tính năng gọi thoại đang phát triển', 'info')} title="Bắt đầu gọi thoại">
        <i className="bi bi-telephone-fill fs-5"></i>
      </button>

      <button className="btn btn-light rounded-circle text-primary me-2 d-none d-sm-block" onClick={() => showAlert('Tính năng gọi video đang phát triển', 'info')} title="Bắt đầu gọi video">
        <i className="bi bi-camera-video-fill fs-5"></i>
      </button>

      <div className="dropdown">
        <button className="btn btn-link text-muted p-2" type="button" data-bs-toggle="dropdown">
          <i className="bi bi-three-dots-vertical fs-5"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: '240px', borderRadius: '12px' }}>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert('Đang mở trang cá nhân...', 'info')}><i className="bi bi-person-circle fs-5 me-3 text-secondary"></i> Xem trang cá nhân</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert('Đã tắt thông báo cho cuộc trò chuyện này.', 'success')}><i className="bi bi-bell-slash fs-5 me-3 text-secondary"></i> Tắt thông báo</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert('Bảng màu chủ đề đang phát triển...', 'info')}><i className="bi bi-palette fs-5 me-3 text-secondary"></i> Chủ đề</button></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert('Tính năng tìm kiếm đang phát triển...', 'info')}><i className="bi bi-search fs-5 me-3 text-secondary"></i> Tìm kiếm trong cuộc trò chuyện</button></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button className="dropdown-item py-2 fw-medium" onClick={() => showAlert('Đã chặn người dùng này.', 'warning')}><i className="bi bi-dash-circle fs-5 me-3 text-secondary"></i> Chặn</button></li>
          <li><button className="dropdown-item py-2 text-danger fw-medium" onClick={() => showAlert('Đã báo cáo tài khoản này!', 'warning')}><i className="bi bi-exclamation-triangle fs-5 me-3"></i> Báo cáo</button></li>
        </ul>
      </div>
    </div>
  );
};
