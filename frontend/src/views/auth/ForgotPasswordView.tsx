import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Toast } from '../../components/common';
import { authService } from '../../services';

const ForgotPasswordView = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.verifyOTP(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword(email, newPassword);
      setSuccessMsg('Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2 className="text-center mb-4">Quên mật khẩu</h2>
        
        {error && <div className="alert alert-danger p-2 mb-3 fs-7">{error}</div>}
        {successMsg && <div className="alert alert-success p-2 mb-3 fs-7">{successMsg}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <p className="text-center mb-4 text-muted small">Nhập email của bạn để nhận mã OTP 6 số.</p>
            <Input 
              label="Email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-decoration-none text-muted small"><i className="bi bi-arrow-left me-1"></i>Quay lại đăng nhập</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-center mb-4 text-muted small">Mã OTP gồm 6 chữ số đã được gửi đến <strong>{email}</strong>.</p>
            <div className="mb-4">
              <Input 
                label="Nhập mã OTP"
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength={6}
                required 
                style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </div>
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Đang kiểm tra...' : 'Xác nhận OTP'}
            </Button>
            <div className="text-center">
              <span className="text-muted small cursor-pointer" onClick={() => setStep(1)}>Thử lại email khác</span>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-center mb-4 text-muted small">Tạo mật khẩu mới cho tài khoản của bạn.</p>
            <Input 
              label="Mật khẩu mới"
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <Input 
              label="Xác nhận mật khẩu mới"
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading || !successMsg && false}>
              {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordView;
