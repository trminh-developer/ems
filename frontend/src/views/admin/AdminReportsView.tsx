import React, { useState, useEffect } from 'react';
import { Button, Loading } from '../../components/common';
import apiClient from '../../services/apiClient';

const AdminReportsView = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await apiClient.get('/admin/reports');
      setReports(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = async (id: string, action: string) => {
    try {
      await apiClient.put(`/admin/reports/${id}`, { status: action });
      setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));
    } catch (e) {
      alert('Lỗi cập nhật Ticket');
    }
  };

  if (isLoading) return <Loading text="Đang tải Tickets..." />;

  return (
    <div>
      <h2 className="mb-4">Quản Lý Reports / Tickets</h2>
      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Người bị Tố cáo</th>
                  <th>Lý do</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-4">Chưa có Ticket nào</td></tr>
                )}
                {reports.map(r => (
                  <tr key={r.id}>
                    <td className="align-middle">@{r.Reporter?.username}</td>
                    <td className="align-middle text-danger">@{r.ReportedUser?.username || 'N/A'}</td>
                    <td className="align-middle fw-bold">{r.reason}</td>
                    <td className="align-middle text-wrap" style={{ maxWidth: '250px' }}>{r.description}</td>
                    <td className="align-middle">
                      <span className={`badge ${r.status === 'PENDING' ? 'bg-warning text-dark' : r.status === 'RESOLVED' ? 'bg-success' : 'bg-secondary'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="align-middle">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="align-middle">
                      {r.status === 'PENDING' && (
                        <div className="d-flex gap-2">
                          <Button className="btn-sm btn-success" onClick={() => resolveReport(r.id, 'RESOLVED')}>Duyệt</Button>
                          <Button className="btn-sm btn-secondary" onClick={() => resolveReport(r.id, 'DISMISSED')}>Hủy</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminReportsView;
