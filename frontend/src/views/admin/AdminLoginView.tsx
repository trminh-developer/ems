import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../components/admin/admin.css';

export default function AdminLoginView() {
  const { user, isAuthenticated, login, logout } = useAuth(), navigate = useNavigate();
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  if (isAuthenticated) return <Navigate to={user?.role === 'ADMIN' || user?.role === 'CENSOR' ? '/admin' : '/'} replace />;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const current = await login(email.trim(), password);
      if (current?.role !== 'ADMIN' && current?.role !== 'CENSOR') { await logout(); setError('Tài khoản này chưa được cấp quyền quản trị.'); return; }
      navigate('/admin', { replace: true });
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : '';
      setError(message === 'Invalid credentials' ? 'Email hoặc mật khẩu chưa chính xác.' : message || 'Chưa thể đăng nhập. Vui lòng thử lại.');
    } finally { setBusy(false); }
  };
  return <div className="hc-admin admin-auth">
    <section className="admin-auth-brand"><Link to="/" className="admin-brand"><span><i className="bi bi-heart-fill" /></span><div>HeartConnect<small>ADMIN WORKSPACE</small></div></Link>
      <div><span className="admin-auth-eyebrow">VÌ NHỮNG KẾT NỐI TỐT ĐẸP</span><h1>Chăm sóc cộng đồng.<br />Nuôi dưỡng kết nối.</h1><p>Không gian làm việc dành cho đội ngũ quản trị và kiểm duyệt HeartConnect.</p><div className="admin-auth-illustration" aria-hidden="true"><span><i className="bi bi-heart" /></span><span><i className="bi bi-people" /></span><span><i className="bi bi-shield-check" /></span></div></div>
      <small>HeartConnect · Kết nối có ý nghĩa</small>
    </section>
    <main className="admin-auth-form"><div><span className="admin-auth-eyebrow">CHÀO MỪNG TRỞ LẠI</span><h2>Đăng nhập quản trị</h2><p>Sử dụng tài khoản đã được cấp quyền để tiếp tục.</p>
      <form onSubmit={submit}>{error && <div className="admin-error" role="alert">{error}</div>}
        <label className="admin-field"><span>Email quản trị</span><input type="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} placeholder="ban@heartconnect.com" /></label>
        <label className="admin-field"><span>Mật khẩu</span><div className="admin-auth-password"><input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} placeholder="Nhập mật khẩu của bạn" /><button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><i className={'bi bi-' + (showPassword ? 'eye-slash' : 'eye')} /></button></div></label>
        <button type="submit" className="admin-button primary" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}<i className="bi bi-arrow-right" /></button>
      </form>
      <div className="admin-auth-return"><Link to="/"><i className="bi bi-arrow-left me-2" />Quay lại ứng dụng</Link><span><i className="bi bi-shield-lock me-1" />Dành cho đội ngũ được cấp quyền</span></div>
    </div></main>
  </div>;
}
