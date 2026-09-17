import React, { useState, useEffect } from "react";
import { Button, Toast, Modal, Input } from "../components/common";
import { useAuth } from "../hooks/useAuth";
import { Gender, RelationshipGoal } from "../models";
import { useAlert } from "../contexts/AlertContext";

const SettingsView = () => {
  const { user, logout, updateUser } = useAuth();
  const { showAlert } = useAlert();

  // Initialize state from user data
  const [onlineStatus, setOnlineStatus] = useState(user?.isOnline ?? true);
  const [preferredGender, setPreferredGender] = useState(
    user?.datingPreference?.preferredGender?.[0] || Gender.FEMALE,
  );
  const [ageMin, setAgeMin] = useState(
    user?.datingPreference?.ageRange?.min || 18,
  );
  const [ageMax, setAgeMax] = useState(
    user?.datingPreference?.ageRange?.max || 30,
  );
  const [maxDistance, setMaxDistance] = useState(
    user?.datingPreference?.maxDistance || 20,
  );
  const [relationshipGoal, setRelationshipGoal] = useState(
    user?.relationshipGoal || RelationshipGoal.NOT_SURE,
  );
  const [showToast, setShowToast] = useState(false);
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setOnlineStatus(user.isOnline ?? true);
      setPreferredGender(user.datingPreference?.preferredGender?.[0] || Gender.FEMALE);
      setAgeMin(user.datingPreference?.ageRange?.min || 18);
      setAgeMax(user.datingPreference?.ageRange?.max || 30);
      setMaxDistance(user.datingPreference?.maxDistance || 20);
      setRelationshipGoal(user.relationshipGoal || RelationshipGoal.NOT_SURE);
      if (!isEditingUsername) {
        setEditUsername(user.username || "");
      }
    }
  }, [user]);

  // Helper to trigger save and show toast
  const saveChanges = (updatedFields: any) => {
    if (user) {
      updateUser({ ...user, ...updatedFields });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleToggleOnline = () => {
    const newVal = !onlineStatus;
    setOnlineStatus(newVal);
    saveChanges({ isOnline: newVal });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Gender;
    setPreferredGender(val);
    saveChanges({
      datingPreference: {
        ...user?.datingPreference,
        preferredGender: [val],
      },
    });
  };

  const handleAgeChange = (min: number, max: number) => {
    setAgeMin(min);
    setAgeMax(max);
    saveChanges({
      datingPreference: {
        ...user?.datingPreference,
        ageRange: { min, max },
      },
    });
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setMaxDistance(val);
    saveChanges({
      datingPreference: {
        ...user?.datingPreference,
        maxDistance: val,
      },
    });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as RelationshipGoal;
    setRelationshipGoal(val);
    saveChanges({ relationshipGoal: val });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Trình duyệt của bạn không hỗ trợ định vị", "error");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        saveChanges({ 
          location: { 
            ...user?.location, 
            city: user?.location?.city || "Unknown",
            country: user?.location?.country || "Unknown",
            latitude, 
            longitude 
          } 
        });
        showAlert("Đã cập nhật vị trí chính xác của bạn!", "success");
      },
      (error) => {
        showAlert("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí cho trang web.", "error");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="settings-view fade-in position-relative">
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
            {isEditingUsername ? (
              <div className="d-flex gap-2">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)} 
                />
                <Button className="btn-primary btn-sm" onClick={() => {
                  saveChanges({ username: editUsername });
                  setIsEditingUsername(false);
                }}>Lưu</Button>
                <Button className="btn-outline-secondary btn-sm" onClick={() => {
                  setEditUsername(user?.username || "");
                  setIsEditingUsername(false);
                }}>Hủy</Button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted fw-bold">@{user?.username}</span>
                <i 
                  className="bi bi-pencil cursor-pointer text-primary ms-2" 
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditingUsername(true)}
                ></i>
              </div>
            )}
          </div>
          <Button 
            className="btn-link p-0 text-decoration-none"
            onClick={() => setIsChangingPassword(true)}
          >
            Đổi mật khẩu
          </Button>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Quyền riêng tư</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Trạng thái hoạt động</span>
            <div className="form-check form-switch toggle-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={onlineStatus}
                onChange={handleToggleOnline}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Định vị chính xác</span>
            <Button className="btn-outline-primary btn-sm" onClick={handleGetLocation}>
              <i className="bi bi-geo-alt me-1"></i> Cập nhật vị trí
            </Button>
          </div>
          {user?.location?.latitude && user?.location?.longitude && (
            <div className="settings-item text-muted small text-end fst-italic">
              Đã cập nhật: {user.location.latitude.toFixed(4)}, {user.location.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Tùy chọn hẹn hò</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3">
            <label className="form-label d-block">Giới tính mong muốn</label>
            <select
              className="form-select w-auto"
              value={preferredGender}
              onChange={handleGenderChange}
            >
              <option value={Gender.FEMALE}>Nữ</option>
              <option value={Gender.MALE}>Nam</option>
              <option value={Gender.OTHER}>Khác</option>
            </select>
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">
              Độ tuổi ({ageMin} - {ageMax})
            </label>
            <div
              className="d-flex align-items-center gap-2"
              style={{ maxWidth: "200px" }}
            >
              <input
                type="text"
                className="form-control"
                value={ageMin}
                onChange={(e) =>
                  handleAgeChange(parseInt(e.target.value) || 18, ageMax)
                }
              />
              <span>-</span>
              <input
                type="text"
                className="form-control"
                value={ageMax}
                onChange={(e) =>
                  handleAgeChange(ageMin, parseInt(e.target.value) || 30)
                }
              />
            </div>
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">
              Khoảng cách tối đa: {maxDistance} km
            </label>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100"
              value={maxDistance}
              onChange={handleDistanceChange}
            />
          </div>
          <div className="settings-item mb-3">
            <label className="form-label d-block">Mục tiêu hẹn hò</label>
            <select
              className="form-select w-auto"
              value={relationshipGoal}
              onChange={handleGoalChange}
            >
              <option value={RelationshipGoal.LONG_TERM}>
                Tìm mối quan hệ nghiêm túc
              </option>
              <option value={RelationshipGoal.SHORT_TERM}>Hẹn hò vui vẻ</option>
              <option value={RelationshipGoal.FRIENDSHIP}>Kết bạn mới</option>
              <option value={RelationshipGoal.NOT_SURE}>Chưa xác định</option>
            </select>
          </div>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section border-danger border">
        <div className="hc-card-body">
          <Button className="btn-danger w-100 mb-3" onClick={logout}>
            Đăng xuất
          </Button>
          <Button className="btn-outline-danger w-100">Xóa tài khoản</Button>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          show={showToast}
          message="Đã lưu cài đặt!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      </div>

      {/* Modal đổi mật khẩu */}
      <Modal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        title="Đổi mật khẩu"
      >
        <div className="p-3">
          <p className="text-muted small mb-3">Nhập mật khẩu mới của bạn bên dưới:</p>
          <Input
            type="password"
            placeholder="Mật khẩu mới..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button 
              className="btn-secondary" 
              onClick={() => setIsChangingPassword(false)}
            >
              Hủy
            </Button>
            <Button 
              className="btn-primary" 
              onClick={() => {
                if (newPassword.trim().length < 6) {
                  showAlert("Mật khẩu phải từ 6 ký tự trở lên!", "error");
                  return;
                }
                saveChanges({ password: newPassword });
                setIsChangingPassword(false);
                setNewPassword("");
                showAlert("Đã đổi mật khẩu thành công!", "success");
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsView;
