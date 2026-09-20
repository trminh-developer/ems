import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Loading } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

const AdminLoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showAlert('Vui lòng nhập đầy đủ thông tin', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Wait for AuthContext to update and ProtectedRoute will handle redirect, 
      // but we can also manually navigate if we want.
      // We will rely on the AdminProtectedRoute logic to redirect or block.
      navigate('/admin');
    } catch (error: any) {
      showAlert(error.message || 'Đăng nhập quản trị thất bại. Vui lòng kiểm tra lại quyền truy cập.', 'error');
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
            placeholder="admin@heartconnect.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
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
