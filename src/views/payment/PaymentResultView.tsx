import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common';

const PaymentResultView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | 'cancelled'>('pending');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    // Phân tích query string từ URL trả về từ cổng thanh toán
    // Ví dụ VNPay trả về: ?vnp_ResponseCode=00&vnp_TxnRef=123&...
    // MoMo trả về: ?resultCode=0&orderId=123&...
    
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const momo_ResultCode = searchParams.get('resultCode');
    
    let currentStatus = 'pending';
    let provider = 'Unknown';
    let orderId = searchParams.get('vnp_TxnRef') || searchParams.get('orderId') || 'N/A';
    
    if (vnp_ResponseCode) {
      provider = 'VNPay';
      currentStatus = vnp_ResponseCode === '00' ? 'success' : 'failed';
    } else if (momo_ResultCode) {
      provider = 'MoMo';
      currentStatus = momo_ResultCode === '0' ? 'success' : 'failed';
    } else {
      // Nếu không có param nào, có thể là trang lỗi hoặc tự truy cập
      currentStatus = 'failed';
    }
    
    setStatus(currentStatus as any);
    setDetails({
      orderId,
      provider,
      amount: searchParams.get('vnp_Amount') 
                ? (parseInt(searchParams.get('vnp_Amount') as string) / 100).toLocaleString() + ' VND'
                : searchParams.get('amount') 
                  ? parseInt(searchParams.get('amount') as string).toLocaleString() + ' VND'
                  : 'N/A',
      transactionId: searchParams.get('vnp_TransactionNo') || searchParams.get('transId') || 'N/A',
      responseCode: vnp_ResponseCode || momo_ResultCode || 'N/A'
    });
    
  }, [searchParams]);

  const renderIcon = () => {
    switch(status) {
      case 'success': return <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>;
      case 'failed': return <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>;
      case 'cancelled': return <i className="bi bi-exclamation-circle-fill text-warning" style={{ fontSize: '4rem' }}></i>;
      default: return <i className="bi bi-hourglass-split text-info" style={{ fontSize: '4rem' }}></i>;
    }
  };

  const getTitle = () => {
    switch(status) {
      case 'success': return 'Thanh Toán Thành Công!';
      case 'failed': return 'Thanh Toán Thất Bại';
      case 'cancelled': return 'Đã Hủy Giao Dịch';
      default: return 'Đang Xử Lý...';
    }
  };

  const getMessage = () => {
    if (status === 'success') return 'Cảm ơn bạn đã nâng cấp Premium. Các tính năng mới đã được mở khóa!';
    if (status === 'failed') return 'Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại sau.';
    return 'Giao dịch đã bị hủy bỏ.';
  };

  if (!details) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5 text-center">
          
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className={`p-4 ${status === 'success' ? 'bg-success bg-opacity-10' : status === 'failed' ? 'bg-danger bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
              <div className="mb-3">
                {renderIcon()}
              </div>
              <h3 className={`fw-bold ${status === 'success' ? 'text-success' : status === 'failed' ? 'text-danger' : 'text-warning'}`}>
                {getTitle()}
              </h3>
              <p className="text-muted mb-0">{getMessage()}</p>
            </div>
            
            <div className="card-body p-4 text-start">
              <h6 className="fw-bold mb-4 border-bottom pb-2">Chi tiết giao dịch</h6>
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Mã đơn hàng</span>
                <span className="fw-semibold">{details.orderId}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Cổng thanh toán</span>
                <span className="fw-semibold">{details.provider} Sandbox</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Số tiền</span>
                <span className="fw-bold text-dark">{details.amount}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Mã giao dịch (Gateway)</span>
                <span className="fw-semibold font-monospace small">{details.transactionId}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Mã phản hồi</span>
                <span className="badge bg-secondary">{details.responseCode}</span>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0 p-4 pt-0 d-grid gap-2">
              {status === 'failed' || status === 'cancelled' ? (
                <Button variant="primary" onClick={() => navigate('/payment')} className="rounded-pill py-2 fw-bold">
                  Thử lại
                </Button>
              ) : null}
              <Button variant="light" onClick={() => navigate('/')} className="rounded-pill py-2 fw-bold border shadow-sm">
                Về Trang Chủ
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentResultView;
