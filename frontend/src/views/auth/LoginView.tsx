import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src="/logo-heartconnect.png" alt="HeartConnect" height="48" className="mb-2" />
          <h2 className="fw-bold text-danger mb-3">HeartConnect</h2>
          <h4 className="text-muted">Welcome back</h4>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password"
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
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <Button type="submit" className="btn-hc-primary w-100 mb-3">Login</Button>
          <div className="text-center mb-3">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="text-center my-3 text-muted">hoặc</div>
          <div className="text-center">
            <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
