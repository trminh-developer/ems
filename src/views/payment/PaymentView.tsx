import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '../../components/common';
import { createPayment } from '../../services/paymentService';
import { v4 as uuidv4 } from 'uuid';

const PaymentView: React.FC = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'vnpay' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem('selected_premium_plan');
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    } else {
      navigate('/premium');
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!selectedMethod || !plan) return;
    
    setIsProcessing(true);
    try {
      const orderId = 'ORD_' + uuidv4().substring(0, 8).toUpperCase();
      
      const response = await createPayment(selectedMethod, {
        orderId,
        amount: plan.price,
        description: `Thanh toan goi Premium ${plan.title}`
      });

      if (response.success && response.paymentUrl) {
        // Chuyển hướng người dùng sang trang thanh toán của VNPay/MoMo
        window.location.href = response.paymentUrl;
      } else {
        alert('Có lỗi khi tạo thanh toán: ' + (response.message || 'Không rõ nguyên nhân'));
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Không thể kết nối đến máy chủ thanh toán! Vui lòng kiểm tra xem Backend (port 3000) đã chạy chưa.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) return <div className="p-5 text-center"><Loading /></div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="d-flex align-items-center mb-4">
            <button className="btn btn-light rounded-circle me-3 shadow-sm" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h3 className="fw-bold mb-0">Thanh Toán</h3>
          </div>

          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: '0.8rem' }}>Chi tiết đơn hàng</h6>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold">Gói Nâng Cấp</span>
                <span className="fw-bold text-warning bg-warning bg-opacity-10 px-2 py-1 rounded">Premium {plan.title}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                <span className="fw-semibold fs-5">Tổng tiền</span>
                <span className="fw-bold text-danger fs-4">{plan.priceLabel}</span>
              </div>
            </div>
          </div>

          <h6 className="fw-bold mb-3 px-2">Phương thức thanh toán</h6>
          <div className="d-flex flex-column gap-3 mb-4">
            {/* VNPay Option */}
            <div 
              className={`card border-2 rounded-4 p-3 cursor-pointer transition-all ${selectedMethod === 'vnpay' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light shadow-sm'}`}
              onClick={() => setSelectedMethod('vnpay')}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                <div className="me-3 bg-white p-2 rounded shadow-sm">
                  <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc/logo-vnpay.png" alt="VNPay" width="40" height="40" style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Ví VNPay / Thẻ ATM</h6>
                  <small className="text-muted">Quét mã QR hoặc thanh toán thẻ</small>
                </div>
                <div className="ms-auto">
                  <div className={`rounded-circle border d-flex align-items-center justify-content-center ${selectedMethod === 'vnpay' ? 'bg-primary border-primary' : 'bg-white'}`} style={{ width: '24px', height: '24px' }}>
                    {selectedMethod === 'vnpay' && <i className="bi bi-check text-white"></i>}
                  </div>
                </div>
              </div>
            </div>

            {/* MoMo Option */}
            <div 
              className={`card border-2 rounded-4 p-3 cursor-pointer transition-all ${selectedMethod === 'momo' ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : 'border-light shadow-sm'}`}
              onClick={() => setSelectedMethod('momo')}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                <div className="me-3 bg-white p-2 rounded shadow-sm">
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" width="40" height="40" style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Ví MoMo</h6>
                  <small className="text-muted">Thanh toán nhanh bằng ứng dụng MoMo</small>
                </div>
                <div className="ms-auto">
                  <div className={`rounded-circle border d-flex align-items-center justify-content-center ${selectedMethod === 'momo' ? 'bg-danger border-danger' : 'bg-white'}`} style={{ width: '24px', height: '24px' }}>
                    {selectedMethod === 'momo' && <i className="bi bi-check text-white"></i>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-grid mt-4">
            <Button 
              variant={selectedMethod ? "primary" : "secondary"} 
              size="lg" 
              className="rounded-pill shadow fw-bold text-white fs-5 py-3"
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              style={selectedMethod ? { background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)', border: 'none' } : {}}
            >
              {isProcessing ? <Loading size="sm" color="light" /> : 'Thanh Toán Ngay'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
