import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../components/admin/AdminContext';
import { adminErrorMessage, useAdminData } from '../../hooks/useAdminData';
import { AdminSettings, adminService } from '../../services/adminService';
import { AdminEmpty, AdminError, AdminHeader, AdminLoading, AdminSectionTitle, RefreshButton } from '../../components/admin/AdminUI';
const defaults: AdminSettings = { MAX_VIOLATIONS: '5', AUTO_BAN_ENABLED: 'true', WARNING_NOTIFICATION_ENABLED: 'true' };
function Settings() {
  const state = useAdminData<{ settings: AdminSettings }>('/admin/settings'), { notify } = useAdmin();
  const [draft, setDraft] = useState(defaults), [baseline, setBaseline] = useState(defaults), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => { if (state.data) { const next = Object.fromEntries(Object.keys(defaults).map(key => [key, state.data!.settings[key as keyof AdminSettings] ?? defaults[key as keyof AdminSettings]])) as unknown as AdminSettings; setDraft(next); setBaseline(next); } }, [state.data]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const update = (key: keyof AdminSettings, value: string) => setDraft(previous => ({ ...previous, [key]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !state.data) return;
    setBusy(true); setError('');
    try { await adminService.settings(draft); setBaseline(draft); notify('Đã lưu chính sách kiểm duyệt.'); }
    catch (failure) { setError(adminErrorMessage(failure)); }
    finally { setBusy(false); }
  };
  return <form onSubmit={save}>
    <AdminHeader title="Cài đặt kiểm duyệt" description="Thiết lập cách hệ thống phản hồi khi thành viên vi phạm tiêu chuẩn cộng đồng.">
      <RefreshButton onClick={state.refresh} busy={state.loading || busy} /><button className="admin-button primary" type="submit" disabled={busy || state.loading || !dirty || !state.data}><i className="bi bi-check2" />{busy ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
    </AdminHeader>
    {(state.error || error) && <AdminError message={state.error || error} retry={state.refresh} />}
    {state.loading ? <AdminLoading /> : <div className="admin-dashboard-grid"><section className="admin-panel padded">
      <AdminSectionTitle title="Chính sách vi phạm" description="Áp dụng cho các báo cáo được xác nhận và có xử phạt." />
      <label className="admin-field"><span>Ngưỡng vi phạm</span><input type="number" min="1" max="20" required value={draft.MAX_VIOLATIONS} disabled={busy || !state.data} onChange={event => update('MAX_VIOLATIONS', event.target.value)} /><small>Số lần vi phạm để áp dụng khóa tự động. Chọn từ 1 đến 20 lần.</small></label>
      <label className="admin-toggle"><div><strong>Tự động khóa tài khoản</strong><p>Khóa tài khoản khi số vi phạm đạt ngưỡng đã chọn.</p></div><input type="checkbox" checked={draft.AUTO_BAN_ENABLED === 'true'} disabled={busy || !state.data} onChange={event => update('AUTO_BAN_ENABLED', event.target.checked ? 'true' : 'false')} /></label>
      <label className="admin-toggle"><div><strong>Gửi thông báo cảnh cáo</strong><p>Thông báo cho thành viên khi nhận thêm vi phạm. Tài khoản bị khóa luôn nhận thông báo.</p></div><input type="checkbox" checked={draft.WARNING_NOTIFICATION_ENABLED === 'true'} disabled={busy || !state.data} onChange={event => update('WARNING_NOTIFICATION_ENABLED', event.target.checked ? 'true' : 'false')} /></label>
      {dirty && <div className="admin-actions mt-3"><span className="admin-note">Bạn có thay đổi chưa lưu.</span><button type="button" className="admin-text-button" disabled={busy} onClick={() => setDraft(baseline)}>Hoàn tác thay đổi</button></div>}
    </section><aside className="admin-panel padded"><AdminSectionTitle title="Chính sách sẽ hoạt động ra sao?" />
      <div className="admin-policy-example"><h3><i className="bi bi-shield-check me-2" />{draft.AUTO_BAN_ENABLED === 'true' ? 'Khóa tự động đang được chọn' : 'Xem xét khóa tài khoản thủ công'}</h3><p>{draft.AUTO_BAN_ENABLED === 'true' ? 'Sau khi một báo cáo được xác nhận và xử phạt, tài khoản đạt từ ' + (draft.MAX_VIOLATIONS || '—') + ' lần vi phạm sẽ bị khóa truy cập.' : 'Số vi phạm vẫn được ghi nhận. Quản trị viên hoặc kiểm duyệt viên có thể xem xét và khóa tài khoản tại trang Thành viên.'}</p></div>
      <p className="admin-note mt-4">Thay đổi chỉ có hiệu lực sau khi lưu và được áp dụng cho các lần xử lý báo cáo tiếp theo. Các tài khoản đã bị khóa không được tự động mở lại.</p>
    </aside></div>}
  </form>;
}
export default function AdminSettingsView() { const { user } = useAuth(); return user?.role === 'ADMIN' ? <Settings /> : <AdminEmpty title="Khu vực dành cho quản trị viên" description="Tài khoản kiểm duyệt không có quyền thay đổi chính sách hệ thống." icon="shield-lock" />; }
