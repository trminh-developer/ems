import React, { useEffect } from 'react';

const AdminDashboardView = () => {
  useEffect(() => { document.title = 'HeartConnect Admin'; }, []);
  return (
    <div>
      <h2 className="mb-4">Tổng quan (Dashboard)</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card bg-dark border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary"><i className="bi bi-people me-2"></i>Tổng User</h5>
              <h2 className="display-4">...</h2>
              <p className="card-text text-muted">Đang cập nhật...</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-dark border-success">
            <div className="card-body">
              <h5 className="card-title text-success"><i className="bi bi-currency-dollar me-2"></i>Doanh thu</h5>
              <h2 className="display-4">...</h2>
              <p className="card-text text-muted">Đang cập nhật...</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="alert alert-info mt-4 border-info bg-dark text-info">
        <i className="bi bi-info-circle me-2"></i> 
        <strong>Chào mừng đến với HeartConnect Admin Panel.</strong> Hệ thống đang chạy ở Giai đoạn 1 (Phase 1). Hãy chuyển sang tab "Users" để quản lý thành viên.
      </div>
    </div>
  );
};

export default AdminDashboardView;

