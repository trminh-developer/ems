import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../components/admin/AdminContext';
import { useAdminData } from '../../hooks/useAdminData';
import { AdminOverview } from '../../services/adminService';
import { AdminBadge, AdminChart, AdminEmpty, AdminError, AdminHeader, AdminLoading, AdminMetric, AdminPeriod, AdminPersona, AdminSectionTitle, RefreshButton, date, money, number } from '../../components/admin/AdminUI';

export default function AdminDashboardView() {
  const { user } = useAuth(), context = useAdmin();
  const [days, setDays] = useState(30);
  const range = useAdminData<AdminOverview>(days === 30 ? null : '/admin/overview?days=' + days);
  const data = days === 30 ? context.overview : range.data;
  const loading = days === 30 ? context.loading : range.loading, error = days === 30 ? context.error : range.error;
  const refresh = () => { context.refreshOverview(); if (days !== 30) range.refresh(); };
  return <>
    <AdminHeader title="Tổng quan hoạt động" description={'Chào ' + (user?.firstName || 'bạn') + ', cùng chăm sóc những kết nối tốt đẹp hôm nay.'}>
      <AdminPeriod value={days} onChange={setDays} /><RefreshButton onClick={refresh} busy={loading} />
    </AdminHeader>
    {error && <AdminError message={error} retry={refresh} />}
    <div className="admin-metrics">
      <AdminMetric label="Tổng thành viên" value={number(data?.users.total)} icon="people" detail={data ? number(data.users.newInPeriod) + ' thành viên mới trong ' + days + ' ngày' : 'Số tài khoản chưa bị xóa'} />
      <AdminMetric label="Hoạt động gần đây" value={number(data?.users.activeWeek)} icon="activity" tone="green" detail="Thành viên hoạt động trong 7 ngày qua" />
      <AdminMetric label="Báo cáo chờ xử lý" value={number(data?.moderation.pendingReports)} icon="flag" tone="amber" detail="Cần được kiểm tra và phản hồi" />
      {user?.role === 'ADMIN' ? <AdminMetric label="Doanh thu đã xác nhận" value={money(data?.revenue)} icon="wallet2" tone="blue" detail={'Giao dịch thành công trong ' + days + ' ngày'} /> :
        <AdminMetric label="Xác thực chờ duyệt" value={number(data?.moderation.pendingVerifications)} icon="patch-check" tone="blue" detail="Yêu cầu xác thực danh tính mới" />}
    </div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel padded">
        <AdminSectionTitle title="Cộng đồng đang kết nối" description={'Thành viên mới và lượt kết đôi trong ' + days + ' ngày · Giờ Việt Nam.'} />
        {loading ? <AdminLoading /> : data ? <AdminChart points={data.trend} lines={[{ key: 'users', name: 'Thành viên mới', color: '#d85c7d' }, { key: 'matches', name: 'Lượt kết đôi', color: '#8b9bb9' }]} label="Biểu đồ thành viên mới và lượt kết đôi theo ngày" /> : <AdminEmpty />}
      </section>
      <section className="admin-panel padded"><AdminSectionTitle title="Cần bạn xem xét" description="Ưu tiên an toàn cho cộng đồng." />
        <Link className="admin-queue-card" to="/admin/reports?status=PENDING"><div className="admin-queue-top"><i className="bi bi-flag" /><strong>Báo cáo vi phạm</strong><b>{number(data?.moderation.pendingReports)}</b></div><p>Kiểm tra nội dung và xử lý báo cáo <i className="bi bi-arrow-right ms-1" /></p></Link>
        <Link className="admin-queue-card" to="/admin/verifications?status=PENDING"><div className="admin-queue-top"><i className="bi bi-patch-check" /><strong>Xác thực danh tính</strong><b>{number(data?.moderation.pendingVerifications)}</b></div><p>Duyệt hồ sơ thành viên đang chờ <i className="bi bi-arrow-right ms-1" /></p></Link>
        <div className="admin-queue-bottom"><i className="bi bi-shield-check me-2" />Mỗi yêu cầu được xử lý giúp cộng đồng đáng tin cậy hơn.</div>
      </section>
    </div>
    <div className="admin-dashboard-grid">
      <section className="admin-panel"><div className="admin-panel-heading"><AdminSectionTitle title="Thành viên mới nhất" description="Những gương mặt vừa gia nhập HeartConnect." to="/admin/users" /></div>
        {loading ? <AdminLoading /> : data?.recentUsers.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Thành viên</th><th>Trạng thái</th><th>Ngày tham gia</th><th /></tr></thead><tbody>{data.recentUsers.map(member => <tr key={member.id}>
          <td><AdminPersona user={member} /></td><td><AdminBadge value={member.status} /></td><td className="nowrap">{date(member.createdAt)}</td><td><Link className="admin-text-button" to={'/admin/users?q=' + encodeURIComponent(member.username)}>Xem hồ sơ <i className="bi bi-arrow-up-right" /></Link></td>
        </tr>)}</tbody></table></div> : <AdminEmpty title="Chưa có thành viên mới" />}
      </section>
      <section className="admin-panel padded"><AdminSectionTitle title="Sức khỏe cộng đồng" description="Một góc nhìn nhanh về nền tảng." />
        <div className="admin-distribution">{[
          { label: 'Thành viên hoạt động', count: data?.users.active, color: '#7aac93' },
          { label: 'Đã xác thực danh tính', count: data?.users.verified, color: '#8e9fbd' },
          { label: 'Premium còn hiệu lực', count: data?.users.premium, color: '#d29c67' },
        ].map(item => <div className="admin-distribution-row" key={item.label}><div className="admin-distribution-label"><span>{item.label}</span><strong>{number(item.count)}</strong></div><div className="admin-bar"><span style={{ width: Math.min(100, (item.count || 0) / Math.max(1, data?.users.total || 0) * 100) + '%', background: item.color }} /></div></div>)}</div>
        <p className="admin-note mt-4 mb-0"><i className="bi bi-clock me-1" />Cập nhật {date(data?.updatedAt, true)}</p>
      </section>
    </div>
  </>;
}
