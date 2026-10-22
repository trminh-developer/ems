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

  const resolveReport = async (id: string, action: string, penalize: boolean = false, username?: string) => {
    try {
      const res = await apiClient.put(`/admin/reports/${id}`, { status: action, penalize });
      setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));

      if (action === 'RESOLVED' && penalize) {
        if (res.data?.autoBanned) {
          alert(`🚨 CẢNH BÁO TỰ ĐỘNG KHÓA:\nNgười dùng @${username || 'được báo cáo'} đã tích lũy ${res.data.currentViolations} lần vi phạm và ĐÃ BỊ TỰ ĐỘNG KHÓA TÀI KHOẢN (BANNED)!`);
        } else {
          alert(`✅ Đã duyệt ticket và xử phạt 1 vi phạm cho @${username || 'user'}.\nSố lần vi phạm hiện tại: ${res.data.currentViolations}/5.`);
        }
      }
    } catch (e: any) {
      alert('Lỗi cập nhật Ticket: ' + (e.response?.data?.error || e.message));
    }
  };

  if (isLoading) return <Loading text="Đang tải Tickets..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Quản Lý Reports / Tickets</h2>
          <p className="text-muted mb-0">Xử lý tố cáo vi phạm, tích lũy số gậy phạt (5 vi phạm tự động khóa tài khoản)</p>
        </div>
      </div>
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
                    <td className="align-middle text-danger fw-bold">@{r.ReportedUser?.username || 'N/A'}</td>
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
                        <div className="d-flex flex-wrap gap-2">
                          <Button 
                            className="btn-sm btn-danger" 
                            title="Xử phạt người bị tố cáo (+1 vi phạm, chạm mốc 5 sẽ tự động khóa)"
                            onClick={() => resolveReport(r.id, 'RESOLVED', true, r.ReportedUser?.username)}
                          >
                            <i className="bi bi-shield-slash me-1"></i>Xử phạt (+1)
                          </Button>
                          <Button 
                            className="btn-sm btn-outline-success" 
                            title="Duyệt đóng ticket nhưng không xử phạt người dùng"
                            onClick={() => resolveReport(r.id, 'RESOLVED', false)}
                          >
                            Duyệt
                          </Button>
                          <Button 
                            className="btn-sm btn-secondary" 
                            title="Bỏ qua tố cáo"
                            onClick={() => resolveReport(r.id, 'DISMISSED', false)}
                          >
                            Hủy
                          </Button>
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
