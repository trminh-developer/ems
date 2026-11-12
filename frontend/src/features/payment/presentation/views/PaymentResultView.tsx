import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Loading } from '../../../../components/common';
import apiClient from '../../../../services/apiClient';
import { useAuth } from '../../../../hooks/useAuth';

type PaymentStatus = 'checking' | 'success' | 'failed' | 'pending' | 'error' | 'cancelled';

const PaymentResultView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const refreshRef = useRef(refreshUser);
  refreshRef.current = refreshUser;
  const [status, setStatus] = useState<PaymentStatus>('checking');
  const [retry, setRetry] = useState(0);
  const [manual, setManual] = useState(false);
  const orderId = searchParams.get('orderId');
  const cancelled = searchParams.get('status') === 'cancelled';

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    setStatus('checking');
    const check = async () => {
      if (!orderId) { setStatus('error'); return; }
      try {
        const response = await apiClient.get(`/payments/${encodeURIComponent(orderId)}/status`);
        if (disposed) return;
        setManual(response.data.confirmationMode === 'manual');
        if (response.data.status === 'SUCCESS') {
          await refreshRef.current();
          if (disposed) return;
          localStorage.removeItem('selected_premium_plan');
          setStatus('success');
        } else if (response.data.status === 'FAILED') {
          setStatus('failed');
        } else if (cancelled) {
          setStatus('cancelled');
        } else if (response.data.confirmationMode === 'manual') {
          setStatus('pending');
        } else if (++attempts < 8) {
          timer = setTimeout(check, 2000);
        } else {
          setStatus('pending');
        }
      } catch {
        if (!disposed) setStatus('error');
      }
    };
    void check();
    return () => { disposed = true; if (timer) clearTimeout(timer); };
  }, [orderId, cancelled, retry]);

  if (status === 'checking') return <div className="p-5 text-center"><Loading text="Đang xác nhận thanh toán..." /></div>;

  const messages = {
    success: ['Thanh toán thành công!', 'Gói Premium đã được kích hoạt. Tích xanh và tùy chọn đổi logo đã sẵn sàng trong Cài đặt.'],
    failed: ['Thanh toán thất bại', 'Giao dịch chưa thành công. Vui lòng chọn lại phương thức thanh toán.'],
    cancelled: ['Đã hủy thanh toán', 'Giao dịch chưa được xác nhận thanh toán. Bạn có thể quay lại chọn gói.'],
    pending: ['Đang chờ xác nhận', manual ? 'Đơn chuyển khoản đang chờ quản trị viên đối soát tiền nhận được. Bạn có thể kiểm tra lại sau.' : 'Chưa nhận được xác nhận từ cổng thanh toán. Bạn có thể kiểm tra lại sau ít phút.'],
    error: ['Chưa thể xác nhận giao dịch', 'Không thể tải trạng thái thanh toán. Vui lòng kiểm tra lại.'],
  } as const;
  const [title, message] = messages[status];
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 p-5">
            <i className={`bi ${status === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-warning'} mb-4`} style={{ fontSize: '5rem' }} />
            <h2 className="fw-bold mb-3">{title}</h2>
            <p className="text-muted mb-4">{message}</p>
            {orderId && <p className="text-muted small">Mã đơn hàng: {orderId}</p>}
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {status === 'success' ? (
                <Button variant="primary" onClick={() => navigate('/settings')}>Tùy chỉnh tài khoản</Button>
              ) : (
                <Button variant="primary" onClick={() => setRetry(value => value + 1)}>Kiểm tra lại</Button>
              )}
              {status !== 'success' && <Button variant="outline" onClick={() => navigate('/premium')}>Chọn gói Premium</Button>}
              {manual && status === 'pending' && orderId && <Button variant="outline" onClick={() => navigate(`/payment/bank/${encodeURIComponent(orderId)}`)}>Xem QR và mã giao dịch</Button>}
              <Button variant="secondary" onClick={() => navigate('/')}>Trang chủ</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultView;
