import React, { useState, useEffect } from 'react';
import { Button, Loading } from '../../components/common';
import apiClient from '../../services/apiClient';
import { User } from '../../models';

const AdminUsersView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e); alert('Error fetching users: ' + (e.response?.data?.error || e.message || e));
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async (id: string, newRole: string) => {
    if (!window.confirm(`Bạn có chắc muốn cấp quyền ${newRole} cho User này?`)) return;
    try {
      await apiClient.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole as any } : u));
    } catch (e) {
      console.error(e); alert('Error fetching users: ' + (e.response?.data?.error || e.message || e));
      alert('Lỗi cập nhật phân quyền');
    }
  };

  const revokeVerification = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn HỦY tích xanh của User này?')) return;
    try {
      await apiClient.put(`/admin/users/${id}/verification/revoke`);
      setUsers(users.map(u => u.id === id ? { ...u, isVerified: false, is_verified: false } as any : u));
    } catch (e) {
      console.error(e); alert('Error fetching users: ' + (e.response?.data?.error || e.message || e));
      alert('Lỗi hủy xác thực');
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    if (!window.confirm(`Bạn có chắc muốn chuyển User này sang trạng thái: ${newStatus}?`)) return;

    try {
      await apiClient.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus as any } : u));
    } catch (e) {
      console.error(e); alert('Error fetching users: ' + (e.response?.data?.error || e.message || e));
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const resetViolations = async (id: string, username: string) => {
    if (!window.confirm(`Bạn có chắc muốn đặt lại số lần vi phạm của @${username} về 0?`)) return;
    try {
      await apiClient.put(`/admin/users/${id}/reset-violations`);
      setUsers(users.map(u => u.id === id ? { ...u, violation_count: 0 } : u));
      alert(`Đã đặt lại số vi phạm của @${username} về 0.`);
    } catch (e: any) {
      console.error(e);
      alert('Lỗi đặt lại số vi phạm: ' + (e.response?.data?.error || e.message));
    }
  };

  if (isLoading) return <Loading text="Đang tải danh sách người dùng..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Người Dùng</h2>
        <div className="text-muted">Tổng cộng: {users.length} Users</div>
      </div>

      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phân quyền</th>
                  <th>Trạng thái</th>
                  <th>Vi phạm</th>
                  <th>Tick xanh</th>
                  <th>Ngày tham gia</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="align-middle">{u.firstName || u.first_name} {u.lastName || u.last_name}</td>
                    <td className="align-middle">@{u.username}</td>
                    <td className="align-middle">{u.email}</td>
                      <td className="align-middle">
                        <select 
                          className={`form-select form-select-sm shadow-none text-white fw-bold bg-${u.role === 'ADMIN' ? 'danger' : u.role === 'CENSOR' ? 'warning' : 'info'}`} 
                          style={{ width: '110px' }} 
                          value={u.role || 'USER'} 
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          disabled={u.email === 'admin@heartconnect.com'}
                        >
                          <option value='USER' className='bg-dark text-white'>USER</option>
                          <option value='CENSOR' className='bg-dark text-white'>CENSOR</option>
                          <option value='ADMIN' className='bg-dark text-white'>ADMIN</option>
                        </select>
                      </td>
                    <td className="align-middle">
                      <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-danger text-white'}`}>
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${
                        (u.violation_count || 0) >= 5 
                          ? 'bg-danger' 
                          : (u.violation_count || 0) > 0 
                            ? 'bg-warning text-dark' 
                            : 'bg-secondary'
                      }`}>
                        {(u.violation_count || 0) >= 5 && <i className="bi bi-shield-x me-1"></i>}
                        {u.violation_count || 0} / 5
                      </span>
                    </td>
                    <td className="align-middle">
                      {u.isVerified || u.is_verified ? <i className="bi bi-patch-check-fill text-primary"></i> : '-'}
                    </td>
                    <td className="align-middle">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-2">
                          {u.role !== 'ADMIN' && (
                            <Button 
                              variant={u.status === 'ACTIVE' ? 'danger' : 'success'}
                              size="sm"
                              onClick={() => toggleUserStatus(u.id, u.status || 'ACTIVE')}
                            >
                              {u.status === 'ACTIVE' ? 'Khóa (Ban)' : 'Mở khóa'}
                            </Button>
                          )}
                          {(u.violation_count || 0) > 0 && (
                            <Button
                              variant="outline-warning"
                              size="sm"
                              title="Đặt lại số lần vi phạm về 0"
                              onClick={() => resetViolations(u.id, u.username)}
                            >
                              <i className="bi bi-arrow-counterclockwise me-1"></i>Reset vi phạm
                            </Button>
                          )}
                          {(u.isVerified || u.is_verified) && (
                            <Button 
                              variant="warning"
                              size="sm"
                              onClick={() => revokeVerification(u.id)}
                            >
                              Hủy Tích Xanh
                            </Button>
                          )}
                        </div>
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

export default AdminUsersView;



