import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';

const RegisterView = () => {
  const { t } = useTranslation();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwords_mismatch'));
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsSubmitting(false);
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
          <img src="/logo-heartconnect.png" alt="HeartConnect" height="48" className="mb-2" />
          <h2 className="fw-bold text-danger mb-3">HeartConnect</h2>
          <h4 className="text-muted">{t('auth.create_account')}</h4>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Input label={t('auth.first_name')} name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <Input label={t('auth.last_name')} name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <Input label={t('auth.email')} type="email" name="email" value={formData.email} onChange={handleChange} required />
          <Input label={t('auth.password')} type="password" name="password" value={formData.password} onChange={handleChange} required />
          <Input label={t('auth.confirm_password')} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          <div className="mb-3">
            <label className="form-label">{t('auth.gender')}</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">{t('common.male')}</option>
              <option value="female">{t('common.female')}</option>
              <option value="other">{t('common.other')}</option>
            </select>
          </div>
          <Input label={t('auth.date_of_birth')} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          
          <Button type="submit" className="btn-hc-primary w-100 mb-3" disabled={isSubmitting}>
            {isSubmitting ? t('auth.registering') : t('auth.register_btn')}
          </Button>
          <div className="text-center">
            <Link to="/login">{t('auth.already_have_account')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;
