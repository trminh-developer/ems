import React, { useState } from 'react';
import { useAdminList, adminErrorMessage } from '../../../../hooks/useAdminData';
import { AdminTransaction } from '../../../../services/adminService';
import apiClient from '../../../../services/apiClient';
import { AdminDialog, AdminEmpty, AdminError, AdminLoading, AdminPagination, AdminPersona, AdminSectionTitle, RefreshButton, date, money } from '../../../../components/admin/AdminUI';
import type { DirectBankTransfer } from '../../domain/BankTransfer';

interface PendingBankOrder extends AdminTransaction { paymentDetails: DirectBankTransfer }

export function BankReconciliation({ onConfirmed }: { onConfirmed: () => void }) {
  const state = useAdminList<PendingBankOrder>('/payments/bank/pending');
  const [selected, setSelected] = useState<PendingBankOrder | null>(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const choose = (order: PendingBankOrder) => {
    setSelected(order); setReference(order.paymentDetails.submission?.reference || '');
    setAmount(''); setVerified(false); setError(''); setSuccess('');
  };
  const confirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true); setError('');
    try {
      await apiClient.post(`/payments/bank/${encodeURIComponent(selected.id)}/confirm`, { reference, amount: Number(amount), verified });
      setSuccess('Đã xác nhận chuyển khoản và kích hoạt Premium.'); setSelected(null);
      state.refresh(); onConfirmed();
    } catch (failure) { setError(adminErrorMessage(failure)); }
    finally { setBusy(false); }
  };
  return <section className="admin-panel">
    <div className="admin-panel-heading"><AdminSectionTitle title="Đối soát chuyển khoản QR" description="Các đơn đã gửi mã giao dịch. Chỉ duyệt khi đã kiểm tra tiền thực nhận và người chuyển trong tài khoản BIDV." /><RefreshButton onClick={state.refresh} busy={state.loading} /></div>
    {success && <p className="alert alert-success mx-3" role="status">{success}</p>}
    {state.error && <AdminError message={state.error} retry={state.refresh} />}
    {state.loading ? <AdminLoading /> : state.data?.items.length ? <div className="admin-table-wrap"><table className="admin-table">
      <thead><tr><th>Thành viên</th><th>Đơn hàng / Gói</th><th>Số tiền</th><th>Mã giao dịch đã gửi</th><th>Ngày gửi</th><th>Thao tác</th></tr></thead>
      <tbody>{state.data.items.map(order => <tr key={order.id}>
        <td><AdminPersona user={order.user} email /></td><td><strong>{order.planId === '1_month' ? '1 tháng' : order.planId === '6_months' ? '6 tháng' : '12 tháng'}</strong><small className="d-block text-break">{order.id}</small></td>
        <td>{money(order.amount)}</td><td>{order.paymentDetails.submission?.reference}</td><td className="nowrap">{date(order.paymentDetails.submission?.submittedAt, true)}</td>
        <td><button type="button" className="admin-button primary" onClick={() => choose(order)}>Đối soát</button></td>
      </tr>)}</tbody>
    </table></div> : !state.error && <AdminEmpty title="Chưa có đơn cần đối soát" description="Đơn sẽ xuất hiện khi người mua gửi mã giao dịch ngân hàng." icon="bank" />}
    <AdminPagination data={state.data} onChange={state.setFilter} busy={state.loading} />
    {selected && <AdminDialog title="Xác nhận tiền chuyển khoản" onClose={() => setSelected(null)} busy={busy} footer={<>
      <button type="button" className="admin-button secondary" onClick={() => setSelected(null)} disabled={busy}>Hủy</button>
      <button type="submit" form="bank-reconcile-form" className="admin-button primary" disabled={busy || !verified || Number(amount) !== selected.amount}>{busy ? 'Đang lưu...' : 'Xác nhận và kích hoạt Premium'}</button>
    </>}>
      <p>Đơn <strong className="text-break">{selected.id}</strong> cần nhận <strong>{money(selected.amount)}</strong> tại <strong>{selected.paymentDetails.bank} · {selected.paymentDetails.account}</strong>.</p>
      <p className="small text-muted">Nội dung QR dùng chung theo gói. Hãy đối chiếu thêm người chuyển và mã giao dịch trên sao kê trước khi xác nhận.</p>
      <form id="bank-reconcile-form" onSubmit={confirm}>
        <label className="form-label" htmlFor="verified-bank-reference">Mã giao dịch trên sao kê</label>
        <input id="verified-bank-reference" className="form-control mb-3" value={reference} onChange={event => setReference(event.target.value)} minLength={6} maxLength={80} required disabled={busy} />
        <label className="form-label" htmlFor="verified-bank-amount">Số tiền thực nhận (VND)</label>
        <input id="verified-bank-amount" className="form-control mb-3" type="number" min="1" step="1" value={amount} onChange={event => setAmount(event.target.value)} required disabled={busy} placeholder={String(selected.amount)} />
        <label className="d-flex gap-2 align-items-start"><input type="checkbox" className="form-check-input flex-shrink-0" checked={verified} onChange={event => setVerified(event.target.checked)} required disabled={busy} /><span>Tôi đã đối chiếu đúng người chuyển và giao dịch đã vào tài khoản BIDV.</span></label>
      </form>
      {error && <p className="admin-inline-error mt-3" role="alert">{error}</p>}
    </AdminDialog>}
  </section>;
}
