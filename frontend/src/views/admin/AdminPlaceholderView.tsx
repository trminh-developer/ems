import React from 'react';

const AdminPlaceholderView = ({ title, phase }: { title: string, phase: string }) => {
  return (
    <div className="container py-4">
      <h2 className="mb-4">{title}</h2>
      <div className="card bg-dark border-secondary">
        <div className="card-body text-center py-5">
          <i className="bi bi-tools text-muted mb-3" style={{ fontSize: '4rem' }}></i>
          <h4 className="text-white">Module Đang Được Xây Dựng</h4>
          <p className="text-muted mb-0">Tính năng này nằm trong lộ trình {phase} của Hệ sinh thái Admin HeartConnect.</p>
          <p className="text-muted mt-2">Mã nguồn React và API Backend tương ứng sẽ được thiết kế ở các bước tiếp theo.</p>
        </div>
      </div>
    </div>
  );
};
export default AdminPlaceholderView;
