import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/common';
import apiClient from '../../../../services/apiClient';
import type { BankPayment } from '../../domain/BankTransfer';

export function DirectBankQr({ order }: { order: BankPayment }) {
  const transfer = order.transfer!;
  const [reference, setReference] = useState(transfer.submission?.reference || '');
  const [submitted, setSubmitted] = useState(Boolean(transfer.submission));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [qrFailed, setQrFailed] = useState(false);
  const [remoteFallback, setRemoteFallback] = useState(false);
  const amount = order.amount.toLocaleString('vi-VN') + 'đ';

  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied('Đã sao chép: ' + value); }
    catch { setCopied('Hãy chọn và sao chép thông tin bên dưới.'); }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      await apiClient.post(`/payments/bank/${encodeURIComponent(order.orderId)}/submit`, { reference });
      setSubmitted(true);
    } catch (failure: any) { setError(failure.response?.data?.error || 'Chưa gửi được thông tin chuyển khoản. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  };

  return <>
    <p className="fs-3 fw-bold text-danger mt-3 mb-1">{amount}</p>
    <p className="text-muted small">Quét bằng ứng dụng ngân hàng và kiểm tra thông tin người nhận trước khi chuyển.</p>
    <figure className="bank-qr-preview mx-auto">
      {!qrFailed ? <img src={remoteFallback ? transfer.qrUrl : transfer.qrImage} alt={`QR ${transfer.bank} thanh toán Premium ${amount}`} onError={() => { if (!remoteFallback) setRemoteFallback(true); else setQrFailed(true); }} /> : <div className="alert alert-warning">Chưa tải được QR. Bạn có thể chuyển khoản theo thông tin bên dưới.</div>}
      <figcaption className="visually-hidden">{transfer.holder}, tài khoản {transfer.account}, nội dung {transfer.description}</figcaption>
    </figure>
    <a className="btn btn-outline-secondary btn-sm mb-3" href={transfer.qrImage} download>Lưu ảnh QR</a>
    <dl className="bank-transfer-details text-start">
      <div><dt>Ngân hàng</dt><dd>{transfer.bank}</dd></div>
      <div><dt>Chủ tài khoản</dt><dd>{transfer.holder}</dd></div>
      <div><dt>Số tài khoản</dt><dd><span>{transfer.account}</span><button type="button" className="btn btn-light btn-sm" aria-label="Sao chép số tài khoản" onClick={() => void copy(transfer.account)}><i className="bi bi-copy" /></button></dd></div>
      <div><dt>Nội dung</dt><dd><span>{transfer.description}</span><button type="button" className="btn btn-light btn-sm" aria-label="Sao chép nội dung chuyển khoản" onClick={() => void copy(transfer.description)}><i className="bi bi-copy" /></button></dd></div>
    </dl>
    {copied && <p className="small text-success" role="status">{copied}</p>}
    <div className="alert alert-info small text-start">Sau khi chuyển đúng {amount}, gửi mã giao dịch ngân hàng bên dưới. Quản trị viên sẽ đối chiếu tiền nhận được để kích hoạt Premium.</div>
    {submitted && <div className="alert alert-success text-start small" role="status">Đã gửi thông tin chuyển khoản. Đơn đang chờ quản trị viên đối soát; Premium sẽ được kích hoạt khi xác nhận đã nhận tiền.</div>}
    {error && <div className="alert alert-danger small" role="alert">{error}</div>}
    <form onSubmit={submit} className="text-start">
      <label htmlFor="bank-reference" className="form-label fw-semibold">Mã giao dịch ngân hàng</label>
      <input id="bank-reference" className="form-control" value={reference} onChange={event => setReference(event.target.value)} minLength={6} maxLength={80} required autoComplete="off" placeholder="Mã trên biên lai chuyển khoản" disabled={busy} />
      <p className="form-text mb-3">Dùng mã giao dịch thực tế trên ứng dụng ngân hàng để đối chiếu đúng người thanh toán.</p>
      <Button variant="primary" type="submit" className="w-100 rounded-pill py-3" disabled={busy}>{busy ? 'Đang gửi...' : submitted ? 'Cập nhật mã giao dịch' : 'Tôi đã chuyển khoản'}</Button>
    </form>
    <Link className="btn btn-outline-secondary rounded-pill mt-3" to={`/payment/result?orderId=${encodeURIComponent(order.orderId)}`}>Kiểm tra trạng thái</Link>
    <p className="small text-muted text-break mt-3 mb-0">Mã đơn: {order.orderId}</p>
  </>;
}
