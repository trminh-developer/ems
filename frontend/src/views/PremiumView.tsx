import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

const PremiumView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('1_month');

  const plans = [
    {
      id: '1_month',
      title: '1 Tháng',
      price: 99000,
      priceLabel: '99,000đ',
      discount: '',
      popular: false
    },
    {
      id: '6_months',
      title: '6 Tháng',
      price: 499000,
      priceLabel: '499,000đ',
      discount: 'Tiết kiệm 15%',
      popular: true
    },
    {
      id: '12_months',
      title: '12 Tháng',
      price: 899000,
      priceLabel: '899,000đ',
      discount: 'Tiết kiệm 25%',
      popular: false
    }
  ];

  const features = [
    { icon: 'bi-heart-fill text-danger', title: 'Lượt Thích Vô Hạn', desc: 'Thích bao nhiêu người tùy ý' },
    { icon: 'bi-eye-fill text-primary', title: 'Xem Ai Đã Thích Bạn', desc: 'Biết ngay ai đang để ý đến bạn' },
    { icon: 'bi-star-fill text-warning', title: '5 Super Likes Mỗi Ngày', desc: 'Tăng cơ hội ghép đôi thành công' },
    { icon: 'bi-rocket-takeoff-fill text-info', title: 'Tăng Tốc Độ Hiển Thị', desc: 'Hồ sơ của bạn sẽ nổi bật hơn' },
    { icon: 'bi-shield-slash-fill text-secondary', title: 'Không Quảng Cáo', desc: 'Trải nghiệm mượt mà, không bị làm phiền' },
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      // Lưu thông tin gói đã chọn để chuyển qua trang thanh toán
      localStorage.setItem('selected_premium_plan', JSON.stringify(plan));
      navigate('/payment');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="text-center mb-5">
            <div className="d-inline-block p-3 rounded-circle bg-warning text-white mb-3 shadow">
              <i className="bi bi-gem fs-1"></i>
            </div>
            <h2 className="fw-bold bg-gradient-warning" style={{ background: 'linear-gradient(45deg, #ffc107, #ff9800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nâng cấp Premium
            </h2>
            <p className="text-muted">Mở khóa tất cả tính năng, tăng gấp 3 lần cơ hội tìm thấy một nửa của bạn!</p>
          </div>

          <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-3">Đặc Quyền Premium</h5>
              <div className="d-flex flex-column gap-3">
                {features.map((f, i) => (
                  <div key={i} className="d-flex align-items-center">
                    <div className="fs-4 me-3" style={{ width: '40px', textAlign: 'center' }}>
                      <i className={f.icon}></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{f.title}</h6>
                      <small className="text-muted">{f.desc}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h5 className="fw-bold mb-3 px-2">Chọn gói của bạn</h5>
          <div className="row g-3 mb-4">
            {plans.map((plan) => (
              <div key={plan.id} className="col-4">
                <div 
                  className={`card h-100 cursor-pointer transition-all border-2 ${selectedPlan === plan.id ? 'border-warning bg-warning bg-opacity-10' : 'border-light'}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
                >
                  {plan.popular && (
                    <span className="badge bg-danger position-absolute top-0 start-50 translate-middle" style={{ fontSize: '0.65rem' }}>
                      PHỔ BIẾN
                    </span>
                  )}
                  <div className="card-body text-center p-2 p-md-3 d-flex flex-column justify-content-center">
                    <h6 className="fw-bold mb-2">{plan.title}</h6>
                    <div className="fw-bold text-warning mb-1" style={{ fontSize: '1.1rem' }}>{plan.priceLabel}</div>
                    {plan.discount && (
                      <small className="text-danger fw-semibold" style={{ fontSize: '0.7rem' }}>{plan.discount}</small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-grid mt-4">
            <Button 
              variant="warning" 
              size="lg" 
              className="rounded-pill shadow fw-bold text-white fs-5 py-3"
              onClick={handleContinue}
              style={{ background: 'linear-gradient(45deg, #ff9800, #ff5722)', border: 'none' }}
            >
              Tiếp tục thanh toán <i className="bi bi-arrow-right ms-2"></i>
            </Button>
            <div className="text-center mt-3">
              <small className="text-muted">Thanh toán an toàn 100% qua MoMo và VNPay.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumView;
