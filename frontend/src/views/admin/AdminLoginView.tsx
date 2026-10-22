import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Input, Loading } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

const AdminLoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, user, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  if (isAuthenticated) {
    if (user?.role === 'ADMIN' || user?.role === 'CENSOR') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showAlert('Vui lòng nhập đầy đủ thông tin', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser: any = await login(email, password);
      
      if (loggedInUser?.role !== 'ADMIN' && loggedInUser?.role !== 'CENSOR') {
        logout();
        showAlert('Tài khoản của bạn không có quyền quản trị.', 'error');
        return;
      }
      
      navigate('/admin');
    } catch (error: any) {
      const msg = error.message === 'Invalid credentials'
        ? 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'
        : (error.message || 'Đăng nhập quản trị thất bại. Vui lòng kiểm tra lại quyền truy cập.');
      showAlert(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#121212' }}>
      <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold fs-3" style={{ color: '#ff6b6b' }}>HeartConnect Admin</h2>
          <p className="text-muted">Hệ thống quản trị nền tảng</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <Input
            label="Email Quản trị"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          
          <Button type="submit" className="btn-primary w-100 mt-3" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <a href="/" className="text-muted text-decoration-none small">
            <i className="bi bi-arrow-left me-1"></i> Quay lại App Hẹn Hò
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginView;

