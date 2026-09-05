import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Loading } from '../../../../components/common';

const PaymentResultView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const queryStatus = searchParams.get('status');
    const queryOrderId = searchParams.get('orderId');

    if (queryStatus === 'success' || queryStatus === 'failed') {
      setStatus(queryStatus);
    }
    if (queryOrderId) {
      setOrderId(queryOrderId);
    }

    if (queryStatus === 'success') {
      // Clear plan
      localStorage.removeItem('selected_premium_plan');
    }
  }, [searchParams]);

  if (!status) {
    return <div className="p-5 text-center"><Loading /></div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-12 col-md-8 col-lg-6">
          {status === 'success' ? (
            <div className="card shadow-sm border-0 rounded-4 p-5">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              <h2 className="fw-bold mb-3">Thanh Toán Thành Công!</h2>
              <p className="text-muted mb-4">
                Cảm ơn bạn đã nâng cấp gói Premium. Trải nghiệm ngay những tính năng độc quyền dành riêng cho bạn.
              </p>
              {orderId && <p className="text-muted small">Mã đơn hàng: {orderId}</p>}
              <Button variant="primary" size="lg" className="rounded-pill px-5" onClick={() => navigate('/')}>
                Về Trang Chủ
              </Button>
            </div>
          ) : (
            <div className="card shadow-sm border-0 rounded-4 p-5">
              <div className="mb-4">
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
              </div>
              <h2 className="fw-bold mb-3">Thanh Toán Thất Bại</h2>
              <p className="text-muted mb-4">
                Đã có lỗi xảy ra trong quá trình thanh toán hoặc bạn đã hủy giao dịch. Vui lòng thử lại.
              </p>
              {orderId && <p className="text-muted small">Mã đơn hàng: {orderId}</p>}
              <Button variant="outline-primary" size="lg" className="rounded-pill px-5 me-3" onClick={() => navigate('/premium')}>
                Thử Lại
              </Button>
              <Button variant="secondary" size="lg" className="rounded-pill px-5" onClick={() => navigate('/')}>
                Trang Chủ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultView;