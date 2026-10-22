import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../components/common';
import { authService } from '../../services';

const ForgotPasswordView = () => {
  const { t } = useTranslation();
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
      setError(t('auth.passwords_mismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword(email, newPassword);
      setSuccessMsg(t('auth.reset_success'));
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
        <h2 className="text-center mb-4">{t('auth.forgot_password_title')}</h2>
        
        {error && <div className="alert alert-danger p-2 mb-3 fs-7">{error}</div>}
        {successMsg && <div className="alert alert-success p-2 mb-3 fs-7">{successMsg}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <p className="text-center mb-4 text-muted small">{t('auth.enter_email_desc')}</p>
            <Input 
              label={t('auth.email')}
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading}>
              {isLoading ? t('auth.sending_otp') : t('auth.send_otp')}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-decoration-none text-muted small">
                <i className="bi bi-arrow-left me-1"></i>{t('auth.back_to_login')}
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-center mb-4 text-muted small">{t('auth.otp_sent_to')} <strong>{email}</strong>.</p>
            <div className="mb-4">
              <Input 
                label={t('auth.enter_otp')}
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength={6} 
                required 
                style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </div>
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading || otp.length !== 6}>
              {isLoading ? '...' : t('auth.verify_otp')}
            </Button>
            <div className="text-center">
              <span className="text-muted small cursor-pointer" onClick={() => setStep(1)} style={{ cursor: 'pointer' }}>
                Email
              </span>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-center mb-4 text-muted small">{t('auth.new_password')}</p>
            <Input 
              label={t('auth.new_password')}
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <Input 
              label={t('auth.confirm_password')}
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isLoading}>
              {t('auth.reset_password')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordView;
