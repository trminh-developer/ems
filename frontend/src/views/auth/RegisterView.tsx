import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

const RegisterView = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    dateOfBirth: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      // Reset form data when error occurs (e.g., user already registered)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
        dateOfBirth: ''
      });
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src="/logo-heartconnect.png" alt="HeartConnect" height="48" className="mb-3" />
          <h2>Tạo tài khoản mới</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          
          <Button type="submit" className="btn-hc-primary w-100 mb-3">Register</Button>
          <div className="text-center">
            <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;
