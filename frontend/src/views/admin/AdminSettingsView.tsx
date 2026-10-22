import React, { useState, useEffect } from 'react';
import { Button, Loading } from '../../components/common';
import apiClient from '../../services/apiClient';

interface SettingsState {
  MAX_VIOLATIONS: string;
  AUTO_BAN_ENABLED: string;
  WARNING_NOTIFICATION_ENABLED: string;
  MAINTENANCE_MODE: string;
  DEFAULT_MAX_DISTANCE: string;
  MIN_AGE: string;
}

const defaultState: SettingsState = {
  MAX_VIOLATIONS: '5',
  AUTO_BAN_ENABLED: 'true',
  WARNING_NOTIFICATION_ENABLED: 'true',
  MAINTENANCE_MODE: 'false',
  DEFAULT_MAX_DISTANCE: '100',
  MIN_AGE: '18',
};

const AdminSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/admin/settings');
      if (res.data?.settings) {
        setSettings(prev => ({
          ...prev,
          ...res.data.settings
        }));
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setErrorMessage('Không thể tải cài đặt máy chủ. Sử dụng cấu hình mặc định.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setErrorMessage('');

      await apiClient.put('/admin/settings', { settings });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMessage('Lỗi khi lưu cài đặt tham số máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof SettingsState, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <Loading text="Đang tải tham số máy chủ..." />;
  }

  const maxViolationsNum = parseInt(settings.MAX_VIOLATIONS, 10) || 5;
  const isAutoBan = settings.AUTO_BAN_ENABLED === 'true';

  return (
    <div className="admin-settings-page pb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Cài Đặt Tham Số Máy Chủ</h2>
          <p className="text-muted mb-0">
            Quản lý ngưỡng kiểm duyệt vi phạm, chính sách khóa tài khoản tự động và cấu hình vận hành hệ thống
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={fetchSettings}
            disabled={isSaving}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Tải lại
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang lưu...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i>Lưu Cài Đặt
              </>
            )}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>
            <strong>Thành công!</strong> Cài đặt tham số máy chủ đã được lưu và có hiệu lực ngay lập tức.
          </div>
          <button type="button" className="btn-close" onClick={() => setSaveSuccess(false)}></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{errorMessage}</div>
          <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          {/* Card 1: Moderation & Auto Ban Policy */}
          <div className="col-12 col-lg-7">
            <div className="card bg-dark border-secondary h-100 shadow-sm">
              <div className="card-header border-secondary bg-transparent py-3 d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock-fill text-danger fs-5"></i>
                <h5 className="mb-0 fw-bold">Chính Sách Kiểm Duyệt & Tự Động Khóa (Auto-Ban)</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger d-flex gap-3 mb-4">
                  <i className="bi bi-exclamation-octagon-fill text-danger fs-3 flex-shrink-0"></i>
                  <div>
                    <h6 className="fw-bold text-danger mb-1">Cơ Chế Bảo Vệ Tự Động Đang Kích Hoạt</h6>
                    <p className="mb-0 fs-7 text-white-50">
                      Khi một tài khoản tích lũy đủ <strong>{maxViolationsNum} lần vi phạm</strong> từ các phiếu tố cáo được duyệt, 
                      máy chủ sẽ <strong>ngay lập tức tự động khóa tài khoản (BANNED)</strong> và thu hồi quyền đăng nhập.
                    </p>
                  </div>
                </div>

                {/* Max Violations Input */}
                <div className="mb-4">
                  <label htmlFor="maxViolations" className="form-label fw-bold text-white d-flex align-items-center gap-2">
                    <span>Số lần vi phạm tối đa trước khi khóa tài khoản:</span>
                    <span className="badge bg-danger fs-6">{maxViolationsNum} lần</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary border-secondary text-white">
                      <i className="bi bi-slash-circle-fill"></i>
                    </span>
                    <input
                      type="number"
                      id="maxViolations"
                      className="form-control bg-dark text-white border-secondary"
                      min="1"
                      max="20"
                      value={settings.MAX_VIOLATIONS}
                      onChange={(e) => handleChange('MAX_VIOLATIONS', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-text text-muted">
                    Khuyến nghị: 5 lần vi phạm (chuẩn mực an toàn cộng đồng HeartConnect).
                  </div>
                </div>

                <hr className="border-secondary my-4" />

                {/* Auto Ban Toggle */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h6 className="fw-bold mb-1 text-white">Tự Động Khóa Tài Khoản Khi Đạt Ngưỡng</h6>
                    <p className="text-muted fs-7 mb-0">
                      Hệ thống tự động chuyển user sang trạng thái <code>BANNED</code> khi chạm mốc {maxViolationsNum} vi phạm.
                    </p>
                  </div>
                  <div className="form-check form-switch fs-4 mb-0">
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      role="switch"
                      checked={isAutoBan}
                      onChange={(e) => handleChange('AUTO_BAN_ENABLED', e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                </div>

                {/* Warning Notification Toggle */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="fw-bold mb-1 text-white">Gửi Thông Báo Cảnh Cáo Hệ Thống</h6>
                    <p className="text-muted fs-7 mb-0">
                      Tự động gửi thông báo răn đe kèm số gậy vi phạm hiện tại mỗi khi quản trị viên duyệt phạt.
                    </p>
                  </div>
                  <div className="form-check form-switch fs-4 mb-0">
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      role="switch"
                      checked={settings.WARNING_NOTIFICATION_ENABLED === 'true'}
                      onChange={(e) => handleChange('WARNING_NOTIFICATION_ENABLED', e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: General & Operational Parameters */}
          <div className="col-12 col-lg-5">
            <div className="card bg-dark border-secondary h-100 shadow-sm">
              <div className="card-header border-secondary bg-transparent py-3 d-flex align-items-center gap-2">
                <i className="bi bi-sliders text-warning fs-5"></i>
                <h5 className="mb-0 fw-bold">Thông Số Vận Hành Máy Chủ</h5>
              </div>
              <div className="card-body">
                {/* Maintenance Mode */}
                <div className="p-3 rounded border border-secondary mb-4 bg-black bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
                        <span>Chế Độ Bảo Trì Máy Chủ</span>
                        {settings.MAINTENANCE_MODE === 'true' && (
                          <span className="badge bg-warning text-dark">Đang Bật</span>
                        )}
                      </h6>
                      <p className="text-muted fs-7 mb-0">
                        Khóa truy cập cho người dùng thông thường khi nâng cấp hệ thống.
                      </p>
                    </div>
                    <div className="form-check form-switch fs-4 mb-0">
                      <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        checked={settings.MAINTENANCE_MODE === 'true'}
                        onChange={(e) => handleChange('MAINTENANCE_MODE', e.target.checked ? 'true' : 'false')}
                      />
                    </div>
                  </div>
                </div>

                {/* Default Max Distance */}
                <div className="mb-4">
                  <label htmlFor="maxDistance" className="form-label fw-bold text-white">
                    Bán kính tìm kiếm ghép đôi mặc định (km):
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary border-secondary text-white">
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                    <input
                      type="number"
                      id="maxDistance"
                      className="form-control bg-dark text-white border-secondary"
                      min="1"
                      max="500"
                      value={settings.DEFAULT_MAX_DISTANCE}
                      onChange={(e) => handleChange('DEFAULT_MAX_DISTANCE', e.target.value)}
                      required
                    />
                    <span className="input-group-text bg-secondary border-secondary text-white">km</span>
                  </div>
                  <div className="form-text text-muted">Phạm vi định vị tối đa khi quét người dùng lân cận.</div>
                </div>

                {/* Minimum Age */}
                <div className="mb-4">
                  <label htmlFor="minAge" className="form-label fw-bold text-white">
                    Độ tuổi tối thiểu đăng ký:
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary border-secondary text-white">
                      <i className="bi bi-person-badge-fill"></i>
                    </span>
                    <input
                      type="number"
                      id="minAge"
                      className="form-control bg-dark text-white border-secondary"
                      min="16"
                      max="30"
                      value={settings.MIN_AGE}
                      onChange={(e) => handleChange('MIN_AGE', e.target.value)}
                      required
                    />
                    <span className="input-group-text bg-secondary border-secondary text-white">tuổi</span>
                  </div>
                  <div className="form-text text-muted">Tuân thủ quy định pháp luật về ứng dụng hẹn hò (18+).</div>
                </div>

                {/* Summary Info */}
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary text-muted fs-7">
                  <div className="d-flex align-items-center gap-2 mb-2 text-white">
                    <i className="bi bi-info-circle-fill text-info"></i>
                    <strong className="fs-7">Quy trình xử phạt 5 lần:</strong>
                  </div>
                  <ol className="ps-3 mb-0">
                    <li>Người dùng bị báo cáo hành vi vi phạm.</li>
                    <li>Admin/Censor duyệt ticket và bấm <strong>"Xử phạt"</strong>.</li>
                    <li>User tăng 1 vi phạm; đạt <strong>{maxViolationsNum}/{maxViolationsNum}</strong> tài khoản tự động bị khóa (BANNED).</li>
                    <li>Admin có thể đặt lại (reset) số vi phạm tại trang Người Dùng.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsView;
