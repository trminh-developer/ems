import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '../../../../components/common';
import { useAuth } from '../../../../hooks/useAuth';
import apiClient from '../../../../services/apiClient';
import { usePaymentDi } from '../../di/PaymentContainer';
import type { Plan } from '../../domain/entities/Plan';
import type { PaymentMethod } from '../../domain/entities/PaymentMethod';
import { findPremiumPlan } from '../../domain/premiumPlans';
import { PaymentLogo } from '../components/PaymentLogo';

const paymentMethods: { id: PaymentMethod; title: string; description: string }[] = [
  { id: 'bank', title: 'Chuyển qua ngân hàng (QR code)', description: 'Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản.' },
  { id: 'momo', title: 'Ví MoMo', description: 'Thanh toán qua ứng dụng MoMo.' },
  { id: 'card', title: 'Thẻ tín dụng / Ghi nợ', description: 'Visa, Mastercard.' },
  { id: 'paypal', title: 'PayPal', description: 'Thanh toán quốc tế qua PayPal.' },
];
type MethodsResponse = { environment: 'sandbox' | 'production' | null; confirmationMode: 'manual' | 'automatic'; methods: Record<PaymentMethod, boolean>; plans: { id: string; price: number; title: string }[] };

export default function PaymentView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPaymentUseCase } = usePaymentDi();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [methods, setMethods] = useState<MethodsResponse['methods'] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [environment, setEnvironment] = useState<MethodsResponse['environment']>(null);
  const [confirmationMode, setConfirmationMode] = useState<MethodsResponse['confirmationMode']>('manual');

  useEffect(() => {
    const controller = new AbortController();
    setMethods(null); setError(''); setSelectedMethod(null);
    let storedId: unknown;
    try { storedId = JSON.parse(localStorage.getItem('selected_premium_plan') || 'null')?.id; } catch { /* Resolve only a known plan ID. */ }
    const selectedPlan = findPremiumPlan(storedId);
    if (!selectedPlan) { navigate('/premium', { replace: true }); return; }
    setPlan(selectedPlan);
    void apiClient.get<MethodsResponse>('/payments/methods', { signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return;
      const serverPlan = data.plans.find(item => item.id === selectedPlan.id);
      if (!serverPlan || !Number.isInteger(serverPlan.price) || serverPlan.price <= 0) throw new Error('Không thể tải giá gói Premium.');
      setPlan({ ...selectedPlan, ...serverPlan, priceLabel: serverPlan.price.toLocaleString('vi-VN') + 'đ' });
      setMethods(data.methods);
      setEnvironment(data.environment);
      setConfirmationMode(data.confirmationMode);
      setSelectedMethod(paymentMethods.find(method => data.methods[method.id])?.id || null);
    }).catch(failure => {
      if (!controller.signal.aborted) setError(failure.response?.data?.error || 'Chưa tải được thông tin thanh toán. Vui lòng thử lại.');
    });
    return () => controller.abort();
  }, [navigate, revision]);

  const handlePayment = async () => {
    if (!plan || !selectedMethod || !methods?.[selectedMethod] || isProcessing) return;
    setIsProcessing(true); setError('');
    try {
      const paymentUrl = await createPaymentUseCase.execute(selectedMethod, plan.id, plan.price, plan.title, user?.id);
      if (selectedMethod === 'bank') navigate(paymentUrl);
      else window.location.href = paymentUrl;
    } catch (failure: any) {
      setError(failure.response?.data?.error || failure.message || 'Không thể tạo đơn thanh toán. Vui lòng thử lại.');
    } finally { setIsProcessing(false); }
  };

  if (!plan) return <div className="p-5 text-center"><Loading /></div>;
  return <div className="container py-5"><div className="row justify-content-center"><div className="col-12 col-md-8 col-lg-6">
    <div className="d-flex align-items-center mb-4">
      <button type="button" aria-label="Quay lại" className="btn btn-light rounded-circle me-3 shadow-sm" onClick={() => navigate('/premium')}><i className="bi bi-arrow-left" /></button>
      <h3 className="fw-bold mb-0">Thanh toán Premium</h3>
    </div>
    <div className="card shadow-sm border-0 rounded-4 mb-4"><div className="card-body p-4">
      <h6 className="text-muted text-uppercase small mb-3">Chi tiết đơn hàng</h6>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3"><span>Gói nâng cấp</span><strong>Premium {plan.title}</strong></div>
      <div className="d-flex justify-content-between align-items-center border-top pt-3"><strong>Tổng tiền</strong><strong className="text-danger fs-4">{plan.priceLabel}</strong></div>
    </div></div>
    {error && <div className="alert alert-danger" role="alert">{error}{!methods && <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => setRevision(value => value + 1)}>Thử lại</button>}</div>}
    {selectedMethod === 'bank' && environment === 'sandbox' && <div className="alert alert-info small">SePay đang ở chế độ thử nghiệm. Giao dịch này không trừ tiền thật.</div>}
    <fieldset disabled={isProcessing} className="payment-methods mb-4">
      <legend className="fs-6 fw-bold mb-3">Phương thức thanh toán</legend>
      {!methods && !error && <Loading text="Đang tải phương thức thanh toán..." />}
      {paymentMethods.map(method => {
        const available = Boolean(methods?.[method.id]);
        return <label key={method.id} className={`payment-option ${selectedMethod === method.id ? 'is-selected' : ''} ${methods && !available ? 'is-disabled' : ''}`}>
          <PaymentLogo method={method.id} />
          <span className="payment-option-content"><strong>{method.title}</strong><small>{methods && !available ? 'Tạm thời chưa khả dụng' : method.description}</small></span>
          <input className="form-check-input flex-shrink-0" type="radio" name="payment-method" value={method.id} checked={selectedMethod === method.id} disabled={!available} onChange={() => setSelectedMethod(method.id)} />
        </label>;
      })}
    </fieldset>
    <Button variant="primary" size="lg" className="w-100 rounded-pill fw-bold py-3" onClick={handlePayment} disabled={!selectedMethod || !methods?.[selectedMethod] || isProcessing}>
      {isProcessing ? 'Đang tạo đơn...' : selectedMethod === 'bank' ? 'Tiếp tục lấy mã QR' : 'Thanh toán ngay'}
    </Button>
    {selectedMethod === 'bank' && <p className="text-muted text-center small mt-3">{confirmationMode === 'manual' ? 'Chuyển khoản bằng QR BIDV. Premium được kích hoạt sau khi quản trị viên đối soát tiền nhận được.' : 'Quét mã QR trên cổng thanh toán SePay. Premium được kích hoạt sau khi SePay xác nhận giao dịch.'}</p>}
  </div></div></div>;
}
