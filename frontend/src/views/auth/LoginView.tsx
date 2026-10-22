import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

const LoginView = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src="/logo-heartconnect.png" alt="HeartConnect" height="48" className="mb-2" />
          <h2 className="fw-bold text-danger mb-3">HeartConnect</h2>
          <h4 className="text-muted">{t('auth.welcome_back')}</h4>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input 
            label={t('auth.email')}
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label={t('auth.password')}
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <div className="mb-3 form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            <label className="form-check-label" htmlFor="rememberMe">{t('auth.remember_me')}</label>
          </div>
          <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isSubmitting}>
            {isSubmitting ? t('auth.logging_in') : t('auth.login_btn')}
          </Button>
          <div className="text-center mb-3">
            <Link to="/forgot-password">{t('auth.forgot_password')}</Link>
          </div>
          <div className="text-center my-3 text-muted">{t('common.or')}</div>
          <div className="text-center">
            <Link to="/register">{t('auth.dont_have_account')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
