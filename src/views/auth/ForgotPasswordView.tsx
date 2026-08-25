import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../../components/common';

const ForgotPasswordView = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h2 className="text-center mb-4">Quên mật khẩu</h2>
        {success ? (
          <div className="text-center">
            <div className="alert alert-success">Đã gửi email đặt lại mật khẩu</div>
            <Link to="/login" className="btn btn-hc-primary w-100">Quay lại đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-center mb-4">Vui lòng nhập email của bạn để nhận link đặt lại mật khẩu.</p>
            <Input 
              label="Email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" className="btn-hc-primary w-100 mb-3">Gửi link đặt lại mật khẩu</Button>
            <div className="text-center">
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordView;
