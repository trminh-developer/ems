import React, { useState, useEffect } from "react";
import { Button, Toast } from "../components/common";
import { useAuth } from "../hooks/useAuth";
import { Gender, RelationshipGoal } from "../models";

const SettingsView = () => {
  const { user, logout, updateUser } = useAuth();

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
            <span className="text-muted">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <Button className="btn-link p-0 text-decoration-none">
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
    </div>
  );
};

export default SettingsView;
