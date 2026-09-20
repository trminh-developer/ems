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
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    if (!window.confirm(`Bạn có chắc muốn chuyển User này sang trạng thái: ${newStatus}?`)) return;

    try {
      await apiClient.put(`/admin/users/${id}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus as any } : u));
    } catch (e) {
      console.error(e);
      alert('Lỗi cập nhật trạng thái');
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
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-info'}`}>
                        {u.role || 'USER'}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="align-middle">
                      {u.isVerified || u.is_verified ? <i className="bi bi-patch-check-fill text-primary"></i> : '-'}
                    </td>
                    <td className="align-middle">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="align-middle">
                      {u.role !== 'ADMIN' && (
                        <Button 
                          className={`btn-sm ${u.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => toggleUserStatus(u.id, u.status || 'ACTIVE')}
                        >
                          {u.status === 'ACTIVE' ? 'Khóa (Ban)' : 'Mở khóa'}
                        </Button>
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

export default AdminUsersView;
