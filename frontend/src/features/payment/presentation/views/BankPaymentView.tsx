import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Loading } from '../../../../components/common';
import apiClient from '../../../../services/apiClient';
import type { BankPayment } from '../../domain/BankTransfer';
import { PaymentLogo } from '../components/PaymentLogo';
import { DirectBankQr } from '../components/DirectBankQr';

export default function BankPaymentView() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);
  const [order, setOrder] = useState<BankPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    submitted.current = false;
    setLoading(true); setError(''); setOrder(null);
    void apiClient.get<BankPayment>(`/payments/bank/${encodeURIComponent(orderId || '')}`, { signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return;
      if (data.status === 'SUCCESS') { navigate(`/payment/result?orderId=${encodeURIComponent(data.orderId)}`, { replace: true }); return; }
      if (data.status !== 'PENDING' || (!data.checkout && !data.transfer)) throw new Error('Đơn thanh toán chưa sẵn sàng. Vui lòng quay lại tạo đơn mới.');
      setOrder(data);
    }).catch(failure => {
      if (!controller.signal.aborted) setError(failure.response?.data?.error || failure.message || 'Không thể mở cổng thanh toán. Vui lòng thử lại.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [orderId, navigate, revision]);

  useEffect(() => {
    if (!order?.checkout || submitted.current) return;
    const timer = setTimeout(() => {
      if (formRef.current && !submitted.current) { submitted.current = true; formRef.current.submit(); }
    }, 100);
    return () => clearTimeout(timer);
  }, [order]);

  return <div className="container py-5"><div className="bank-payment mx-auto">
    <Link className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4" to="/payment"><i className="bi bi-arrow-left" />Quay lại chọn phương thức</Link>
    <div className="card shadow-sm border-0 rounded-4 p-4 text-center">
      <div className="d-flex justify-content-center mb-3"><PaymentLogo method="bank" /></div>
      <h1 className="h4 fw-bold">Chuyển qua ngân hàng (QR code)</h1>
      {loading && <Loading text="Đang chuẩn bị trang thanh toán..." />}
      {error && <div className="alert alert-danger mt-3" role="alert">{error}<button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => setRevision(value => value + 1)}>Thử lại</button></div>}
      {order?.transfer && <DirectBankQr key={order.orderId} order={order} />}
      {order?.checkout && <>
        <p className="fs-3 fw-bold text-danger my-3">{order.amount.toLocaleString('vi-VN')}đ</p>
        {order.checkout.environment === 'sandbox' && <div className="alert alert-info small">Môi trường thử nghiệm SePay — không trừ tiền thật.</div>}
        <p className="text-muted">Đang chuyển đến SePay để hiển thị mã QR. Nếu trang chưa tự mở, hãy bấm nút bên dưới.</p>
        <form ref={formRef} action={order.checkout.checkoutUrl} method="POST">
          {order.checkout.fields.map(field => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
          <Button variant="primary" type="submit" className="w-100 rounded-pill py-3">Mở mã QR thanh toán</Button>
        </form>
        <p className="small text-muted mt-3 mb-0">Premium được kích hoạt khi máy chủ xác nhận giao dịch với SePay.</p>
      </>}
    </div>
  </div></div>;
}
