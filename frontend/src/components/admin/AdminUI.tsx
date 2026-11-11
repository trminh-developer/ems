import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPage, AdminPerson } from '../../services/adminService';
import { adminErrorMessage } from '../../hooks/useAdminData';
import { useAdmin } from './AdminContext';

export const number = (value?: number | null) => value == null ? '—' : new Intl.NumberFormat('vi-VN').format(value);
export const money = (value?: number | null) => value == null ? '—' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
export const date = (value?: string, withTime = false) => value && Number.isFinite(Date.parse(value)) ?
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', ...(withTime ? { timeStyle: 'short' as const } : {}) }).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T12:00:00' : value)) : '—';
export const personName = (user?: AdminPerson | null) => [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Tài khoản không còn khả dụng';

export function AdminHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <div className="admin-page-heading"><div><h1>{title}</h1><p>{description}</p></div><div className="admin-heading-actions">{children}</div></div>;
}
export function RefreshButton({ onClick, busy = false }: { onClick: () => void; busy?: boolean }) {
  return <button type="button" className="admin-button secondary" onClick={onClick} disabled={busy}><i className={`bi bi-arrow-clockwise ${busy ? 'admin-spin' : ''}`} aria-hidden="true" /><span>Làm mới</span></button>;
}
export function AdminMetric({ label, value, icon, detail, tone = 'rose' }: { label: string; value: string; icon: string; detail: string; tone?: string }) {
  return <article className="admin-metric"><div className="admin-metric-label">{label}<span className={`admin-metric-icon ${tone}`}><i className={`bi bi-${icon}`} aria-hidden="true" /></span></div><strong className={value.length > 10 ? 'long-value' : ''} title={value}>{value}</strong><small>{detail}</small></article>;
}
export function AdminPersona({ user, email = false }: { user?: AdminPerson | null; email?: boolean }) {
  const name = personName(user);
  return <div className="admin-person"><span className="admin-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}
    {user?.avatar && <img src={user.avatar} alt="" loading="lazy" onError={event => { event.currentTarget.hidden = true; }} />}</span>
    <span className="admin-person-text"><strong>{name}</strong><small>{email ? user?.email || 'Chưa có email' : user?.username ? '@' + user.username : '—'}</small></span>
  </div>;
}
const labels: Record<string, [string, string]> = {
  ACTIVE: ['Hoạt động', 'green'], BANNED: ['Đã khóa', 'red'], DELETED: ['Đã xóa', 'slate'],
  ADMIN: ['Quản trị viên', 'rose'], CENSOR: ['Kiểm duyệt viên', 'violet'], USER: ['Thành viên', 'slate'],
  PENDING: ['Chờ xử lý', 'amber'], APPROVED: ['Đã duyệt', 'green'], REJECTED: ['Từ chối', 'red'],
  RESOLVED: ['Đã xử lý', 'green'], DISMISSED: ['Đã bỏ qua', 'slate'], SUCCESS: ['Thành công', 'green'], FAILED: ['Thất bại', 'red'],
};
export function AdminBadge({ value, children }: { value?: string; children?: React.ReactNode }) {
  const [label, tone] = labels[value || ''] || [value || 'Chưa có', 'slate'];
  return <span className={`admin-badge ${tone}`}><span aria-hidden="true" />{children || label}</span>;
}
export function AdminEmpty({ title = 'Chưa có dữ liệu', description = 'Kết quả sẽ xuất hiện tại đây khi có dữ liệu mới.', icon = 'inbox' }: { title?: string; description?: string; icon?: string }) {
  return <div className="admin-empty"><span><i className={`bi bi-${icon}`} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></div>;
}
export function AdminError({ message, retry }: { message: string; retry: () => void }) {
  return <div className="admin-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" /><span>{message}</span><button type="button" className="admin-text-button" onClick={retry}>Thử lại</button></div>;
}
export function AdminLoading() { return <div className="admin-loading" role="status"><span className="spinner-border spinner-border-sm" aria-hidden="true" /> Đang tải dữ liệu…</div>; }
export function AdminSearch({ value, onChange, placeholder = 'Tìm kiếm…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="admin-search"><i className="bi bi-search" aria-hidden="true" /><input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} maxLength={150} /></label>;
}
export function AdminSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <label className="admin-select"><span className="visually-hidden">{label}</span><select aria-label={label} value={value} onChange={event => onChange(event.target.value)}>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}
export function AdminPagination({ data, onChange, busy }: { data: AdminPage<unknown> | null; onChange: (key: string, value: string) => void; busy?: boolean }) {
  if (!data) return null;
  return <div className="admin-pagination"><span>{data.total ? `${number((data.page - 1) * data.pageSize + 1)}–${number(Math.min(data.page * data.pageSize, data.total))}` : '0'} trên {number(data.total)} kết quả</span>
    <div><AdminSelect label="Số dòng mỗi trang" value={String(data.pageSize)} onChange={value => onChange('pageSize', value)} options={[["10", "10 dòng"], ["20", "20 dòng"], ["50", "50 dòng"]]} />
      <button type="button" className="admin-icon-button" aria-label="Trang trước" disabled={busy || data.page <= 1} onClick={() => onChange('page', String(data.page - 1))}><i className="bi bi-chevron-left" /></button>
      <span>Trang {data.page}/{data.totalPages}</span>
      <button type="button" className="admin-icon-button" aria-label="Trang sau" disabled={busy || data.page >= data.totalPages} onClick={() => onChange('page', String(data.page + 1))}><i className="bi bi-chevron-right" /></button>
    </div></div>;
}
export function AdminDialog({ title, onClose, children, footer, busy = false, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; busy?: boolean; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null), titleId = useId();
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className={`admin-dialog ${wide ? 'wide' : ''}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} onClick={event => { if (event.target === ref.current && !busy) onClose(); }}>
    <div className="admin-dialog-header"><h2 id={titleId}>{title}</h2><button type="button" className="admin-icon-button" aria-label="Đóng cửa sổ" onClick={onClose} disabled={busy}><i className="bi bi-x-lg" /></button></div>
    <div className="admin-dialog-body">{children}</div>{footer && <div className="admin-dialog-footer">{footer}</div>}
  </dialog>;
}
interface Confirmation { title: string; description: string; label: string; danger?: boolean; action: () => Promise<unknown>; success: string }
export function useAdminAction(onSuccess: () => void) {
  const { notify, refreshOverview } = useAdmin();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const ask = (value: Confirmation) => { setError(''); setConfirmation(value); };
  const run = async () => {
    if (!confirmation || busy) return;
    setBusy(true); setError('');
    try { await confirmation.action(); notify(confirmation.success); setConfirmation(null); onSuccess(); refreshOverview(); }
    catch (failure) { setError(adminErrorMessage(failure)); }
    finally { setBusy(false); }
  };
  const dialog = confirmation && <AdminDialog title={confirmation.title} onClose={() => setConfirmation(null)} busy={busy} footer={<>
    <button type="button" className="admin-button secondary" onClick={() => setConfirmation(null)} disabled={busy} autoFocus>Hủy</button>
    <button type="button" className={`admin-button ${confirmation.danger ? 'danger' : 'primary'}`} onClick={run} disabled={busy}>{busy ? 'Đang lưu…' : confirmation.label}</button>
  </>}><p>{confirmation.description}</p>{error && <p className="admin-inline-error" role="alert">{error}</p>}</AdminDialog>;
  return { ask, busy, dialog };
}
export function AdminPeriod({ value, onChange }: { value: number; onChange: (days: number) => void }) {
  return <div className="admin-period" aria-label="Khoảng thời gian">{[7, 30, 90].map(days => <button type="button" key={days} aria-pressed={value === days} onClick={() => onChange(days)} className={value === days ? 'active' : ''}>{days} ngày</button>)}</div>;
}
export function AdminChart({ points, lines, label, currency = false }: { points: { date: string; [key: string]: string | number }[]; lines: { key: string; name: string; color: string }[]; label: string; currency?: boolean }) {
  const id = useId().replace(/:/g, ''), width = 760, height = 220, inset = 30;
  const rawMax = Math.max(currency ? 1000 : 2, ...points.flatMap(point => lines.map(line => Number(point[line.key] || 0))));
  const max = currency ? rawMax : Math.ceil(rawMax / 2) * 2;
  const x = (index: number) => inset + index / Math.max(1, points.length - 1) * (width - inset * 2);
  const y = (value: number) => height - inset - value / max * (height - inset * 2);
  return <div className="admin-chart"><div className="admin-chart-legend">{lines.map(line => <span key={line.key}><i style={{ background: line.color }} />{line.name}</span>)}</div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lines[0]?.color} stopOpacity="0.13" /><stop offset="100%" stopColor={lines[0]?.color} stopOpacity="0" /></linearGradient></defs>
      {[0, 0.5, 1].map(ratio => <g key={ratio}><line x1={inset} x2={width - inset} y1={y(max * ratio)} y2={y(max * ratio)} stroke="currentColor" opacity="0.09" strokeDasharray="4 5" /><text x={inset} y={y(max * ratio) - 7} className="admin-chart-tick">{currency ? new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(max * ratio) : number(Math.ceil(max * ratio))}</text></g>)}
      {lines.map((line, index) => {
        const coordinates = points.map((point, i) => `${x(i)},${y(Number(point[line.key] || 0))}`).join(' ');
        return <g key={line.key}>{index === 0 && points.length > 0 && <polygon points={`${x(0)},${y(0)} ${coordinates} ${x(points.length - 1)},${y(0)}`} fill={`url(#${id})`} />}
          <polyline points={coordinates} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></g>;
      })}
    </svg>
    <div className="admin-chart-dates"><span>{date(points[0]?.date)}</span><span>{date(points[Math.floor(points.length / 2)]?.date)}</span><span>{date(points[points.length - 1]?.date)}</span></div>
    <details className="admin-chart-data"><summary>Xem dữ liệu biểu đồ</summary><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ngày</th>{lines.map(line => <th key={line.key}>{line.name}</th>)}</tr></thead><tbody>{points.map(point => <tr key={point.date}><td>{date(point.date)}</td>{lines.map(line => <td key={line.key}>{currency ? money(Number(point[line.key])) : number(Number(point[line.key]))}</td>)}</tr>)}</tbody></table></div></details>
  </div>;
}
export function AdminSectionTitle({ title, description, to, link = 'Xem tất cả' }: { title: string; description?: string; to?: string; link?: string }) {
  return <div className="admin-section-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{to && <Link to={to}>{link}<i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>}</div>;
}
