import React, { useState, useEffect, useRef } from "react";
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const [isScanningId, setIsScanningId] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [livenessInstruction, setLivenessInstruction] = useState("Vui lòng nhìn thẳng vào camera");
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<any[]>([]);

  
  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Lỗi mở camera", err);
      showAlert("Không thể mở camera. Vui lòng cấp quyền truy cập.", "error");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  
  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    chunksRef.current = [];
    const mediaRecorder = new (window as any).MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e: any) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setRecordedVideo(reader.result as string);
      };
    };
    
    mediaRecorder.start(200); // 200ms chunks
    
    // Simulate liveness instructions sequence
    const instructions = [
      "Vui lòng nhìn thẳng vào camera",
      "Từ từ xoay mặt sang TRÁI",
      "Từ từ xoay mặt sang PHẢI",
      "Nhìn lên TRÊN",
      "Nhìn xuống DƯỚI",
      "Đưa thiết bị ra XA một chút",
      "Đang xử lý..."
    ];
    
    let step = 0;
    setLivenessInstruction(instructions[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < instructions.length) {
        setLivenessInstruction(instructions[step]);
      }
      if (step >= instructions.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
          stopCamera();
        }, 1000);
      }
    }, 2000); // 2 seconds per instruction
  };
  
  const retakeVideo = () => {
    setRecordedVideo(null);
    setLivenessInstruction("Vui lòng nhìn thẳng vào camera");
    startCamera();
  };
useEffect(() => {
    if (isVerificationModalOpen && verificationStep === 2 && !recordedVideo) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVerificationModalOpen, verificationStep, recordedVideo]);

  useEffect(() => {
    if (user) {
      setOnlineStatus(user.isOnline ?? true);
      setPreferredGender(
        user.datingPreference?.preferredGender?.[0] || Gender.FEMALE,
      );
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
            longitude,
          },
        });
        showAlert("Đã cập nhật vị trí chính xác của bạn!", "success");
      },
      (error) => {
        showAlert(
          "Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí cho trang web.",
          "error",
        );
      },
      { enableHighAccuracy: true },
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
                <Button
                  className="btn-primary btn-sm"
                  onClick={() => {
                    saveChanges({ username: editUsername });
                    setIsEditingUsername(false);
                  }}
                >
                  Lưu
                </Button>
                <Button
                  className="btn-outline-secondary btn-sm"
                  onClick={() => {
                    setEditUsername(user?.username || "");
                    setIsEditingUsername(false);
                  }}
                >
                  Hủy
                </Button>
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
            className="btn-link p-0 text-decoration-none mt-2 d-block"
            onClick={() => setIsChangingPassword(true)}
          >
            Đổi mật khẩu
          </Button>
          <hr className="my-3" />
          <div className="settings-item d-flex justify-content-between align-items-center">
            <span>Xác thực danh tính</span>
            {user?.isVerified ? (
              <span className="text-primary fw-bold"><i className="bi bi-patch-check-fill me-1"></i>Đã xác thực</span>
            ) : isVerificationPending ? (
              <span className="text-warning"><i className="bi bi-hourglass-split me-1"></i>Đang chờ duyệt</span>
            ) : (
              <label className="form-check form-switch toggle-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isVerificationModalOpen}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setIsVerificationModalOpen(true);
                      setVerificationStep(1);
                    } else {
                      setIsVerificationModalOpen(false);
                    }
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="hc-card mb-4 settings-section">
        <div className="hc-card-header settings-section-title">
          <h5 className="mb-0">Quyền riêng tư</h5>
        </div>
        <div className="hc-card-body">
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Trạng thái hoạt động</span>
            <label className="form-check form-switch toggle-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={onlineStatus}
                onChange={handleToggleOnline}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-item mb-3 d-flex justify-content-between align-items-center">
            <span>Định vị chính xác</span>
            <Button
              className="btn-outline-primary btn-sm"
              onClick={handleGetLocation}
            >
              <i className="bi bi-geo-alt me-1"></i> Cập nhật vị trí
            </Button>
          </div>
          {user?.location?.latitude && user?.location?.longitude && (
            <div className="settings-item text-muted small text-end fst-italic">
              Đã cập nhật: {user.location.latitude.toFixed(4)},{" "}
              {user.location.longitude.toFixed(4)}
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
        onClose={() => {
          setIsChangingPassword(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        title="Đổi mật khẩu"
      >
        <div className="p-3">
          <div className="mb-3">
            <label className="form-label text-muted small mb-1">
              Current password
            </label>
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small mb-1">
              New password
            </label>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small mb-1">
              Confirm password
            </label>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              className="btn-secondary"
              onClick={() => {
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Hủy
            </Button>
            <Button
              className="btn-primary"
              onClick={() => {
                if (!currentPassword) {
                  showAlert("Vui lòng nhập mật khẩu hiện tại!", "error");
                  return;
                }
                if (newPassword.trim().length < 6) {
                  showAlert("Mật khẩu mới phải từ 6 ký tự trở lên!", "error");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  showAlert("Mật khẩu nhập lại không khớp!", "error");
                  return;
                }
                saveChanges({ password: newPassword });
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                showAlert("Đã đổi mật khẩu thành công!", "success");
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Xác thực danh tính */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        title="Xác thực danh tính"
      >
          <div className="p-3">
            {verificationStep === 1 && (
              <div>
                <h6 className="mb-3">Bước 1: Giấy tờ tùy thân</h6>
                <p className="text-muted small mb-3">Vui lòng tải lên một trong các giấy tờ sau: CCCD, CMND, Giấy phép lái xe hoặc Hộ chiếu.</p>
                
                  <input type="file" className="form-control mb-2" accept="image/*" onChange={handleIdCardUpload} />
                  {idCardImage && (
                    <div className="mb-4 text-center">
                      <img src={idCardImage} alt="ID Card Preview" className="img-fluid rounded border border-secondary" style={{ maxHeight: '150px' }} />
                    </div>
                  )}

                <div className="d-flex justify-content-end gap-2">
                  <Button className="btn-secondary" onClick={() => setIsVerificationModalOpen(false)}>Hủy</Button>
                  <Button className="btn-primary" disabled={isScanningId || !idCardImage} onClick={() => {
                    setIsScanningId(true);
                    setTimeout(() => {
                      setIsScanningId(false);
                      setVerificationStep(2);
                    }, 2000);
                  }}>
                    {isScanningId ? "Đang quét AI..." : "Tiếp tục"}
                  </Button>
                </div>
              </div>
            )}
            {verificationStep === 2 && (
              <div>
                <h6 className="mb-3">Bước 2: Xác thực khuôn mặt</h6>
                <p className="text-muted small mb-3">Vui lòng đưa khuôn mặt của bạn vào khung hình để đối chiếu với giấy tờ.</p>
                
                <div className="camera-container mb-4 text-center position-relative bg-dark rounded overflow-hidden" style={{ height: "250px" }}>
                  {!capturedImage ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}></video>
                      <Button className="btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4" onClick={capturePhoto}>
                        <i className="bi bi-camera-fill me-2"></i> Chụp ảnh
                      </Button>
                    </>
                  ) : (
                    <>
                      <img src={capturedImage} alt="Selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <Button className="btn-secondary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4" onClick={retakePhoto}>
                        <i className="bi bi-arrow-counterclockwise me-2"></i> Chụp lại
                      </Button>
                    </>
                  )}
                  <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Button className="btn-secondary" onClick={() => setVerificationStep(1)}>Quay lại</Button>
                  <Button className="btn-primary" disabled={!recordedVideo} onClick={() => {
                    setVerificationStep(3);
                  }}>Xác nhận</Button>
                </div>
              </div>
            )}
            {verificationStep === 3 && (
              <div className="text-center py-4">
                <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
                <h6 className="mt-3">Đã gửi yêu cầu thành công!</h6>
                <p className="text-muted small mb-4">Chúng tôi sẽ xem xét giấy tờ của bạn trong vòng 3-7 ngày làm việc.</p>
                <Button className="btn-primary px-4" onClick={async () => {
                  setIsVerificationModalOpen(false);
                  setIsVerificationPending(true);
                  if (user) {
                    try {
                      const apiClient = (await import('../services/apiClient')).default;
                      await apiClient.post(`/users/${user.id}/verification`, {
                        id_card_image: idCardImage, // Real app would use actual file upload base64
                        selfie_image: recordedVideo
                      });
                    } catch (e) {
                      console.error('Failed to submit verification', e);
                    }
                  }
                }}>Đóng</Button>
              </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default SettingsView;


