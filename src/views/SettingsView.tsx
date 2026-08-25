import React, { useState } from 'react';
import { Button } from '../components/common';
import { useAuth } from '../hooks/useAuth';

const SettingsView = () => {
  const { user, logout } = useAuth();
  const [visibility, setVisibility] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [locationVisibility, setLocationVisibility] = useState(true);

  return (
    <div className="settings-view fade-in">
      <h3 className="mb-4">Cài đặt</h3>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Tài khoản</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Email</span>
            <span className="text-muted">{user?.email}</span>
          </div>
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Username</span>
            <span className="text-muted">{user?.firstName} {user?.lastName}</span>
          </div>
          <Button className="btn-link p-0 text-decoration-none">Đổi mật khẩu</Button>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Quyền riêng tư</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Hiển thị hồ sơ</span>
            <div className="form-check form-switch toggle-switch">
              <input className="form-check-input" type="checkbox" checked={visibility} onChange={() => setVisibility(!visibility)} />
            </div>
          </div>
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Trạng thái hoạt động</span>
            <div className="form-check form-switch toggle-switch">
              <input className="form-check-input" type="checkbox" checked={onlineStatus} onChange={() => setOnlineStatus(!onlineStatus)} />
            </div>
          </div>
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Hiển thị vị trí</span>
            <div className="form-check form-switch toggle-switch">
              <input className="form-check-input" type="checkbox" checked={locationVisibility} onChange={() => setLocationVisibility(!locationVisibility)} />
            </div>
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">Quyền nhắn tin</label>
            <select className="form-select w-auto">
              <option value="matches">Chỉ người tương hợp</option>
              <option value="everyone">Tất cả mọi người</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Tùy chọn hẹn hò</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3">
            <label className="form-label d-block">Giới tính mong muốn</label>
            <select className="form-select w-auto">
              <option value="female">Nữ</option>
              <option value="male">Nam</option>
              <option value="both">Cả hai</option>
            </select>
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">Độ tuổi</label>
            <div className="d-flex align-items-center gap-2" style={{ maxWidth: '200px' }}>
              <input type="number" className="form-control" defaultValue={18} />
              <span>-</span>
              <input type="number" className="form-control" defaultValue={30} />
            </div>
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">Khoảng cách tối đa</label>
            <input type="range" className="form-range" min="1" max="100" defaultValue="20" />
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">Mục tiêu hẹn hò</label>
            <select className="form-select w-auto">
              <option value="relationship">Tìm mối quan hệ nghiêm túc</option>
              <option value="friends">Kết bạn mới</option>
              <option value="casual">Hẹn hò vui vẻ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section border-danger border">
        <div className="hc-card-body">
          <Button className="btn-danger w-100 mb-3" onClick={logout}>Đăng xuất</Button>
          <Button className="btn-outline-danger w-100">Xóa tài khoản</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
