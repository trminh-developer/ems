import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading, Modal } from '../components/common';
import apiClient from '../services/apiClient';

interface RequestModel {
  id: string;
  userId: string;
  idCardImage: string;
  selfieImage: string;
  status: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const AdminVerificationsView = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<RequestModel | null>(null);
  
  useEffect(() => {
    fetchRequests();
  }, []);
  
  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/admin/verifications');
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/admin/verifications/${id}/approve`);
      setRequests(requests.filter(r => r.id !== id));
      setSelectedReq(null);
    } catch (e) {
      console.error(e);
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await apiClient.post(`/admin/verifications/${id}/reject`);
      setRequests(requests.filter(r => r.id !== id));
      setSelectedReq(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <Loading text="Đang tải danh sách chờ duyệt..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin: Duyệt Xác Thực Danh Tính</h2>
        <Button className="btn-outline-secondary" onClick={() => navigate("/")}>Về App (User)</Button>
      </div>
      {requests.length === 0 ? (
        <p>Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <div className="row">
          {requests.map(req => (
            <div key={req.id} className="col-md-4 mb-3">
              <div className="card bg-dark border-secondary">
                <div className="card-body">
                  <h5 className="card-title text-white">{req.user?.firstName} {req.user?.lastName}</h5>
                  <p className="card-text text-muted">@{req.user?.username}</p>
                  <Button className="btn-primary w-100" onClick={() => setSelectedReq(req)}>
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title="Chi tiết xác thực">
        {selectedReq && (
          <div className="p-3">
            <h6 className="mb-3">Thông tin User: {selectedReq.user?.firstName} {selectedReq.user?.lastName} ({selectedReq.user?.email})</h6>
            <div className="row mb-4">
                <div className="col-6">
                  <p className="text-muted small mb-1">Giấy tờ tùy thân</p>
                  {selectedReq.idCardImage ? (
                    <img src={selectedReq.idCardImage} alt="ID Card" className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%' }} />
                  ) : (
                    <div className="bg-secondary rounded d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                      <i className="bi bi-card-heading text-white fs-1"></i>
                    </div>
                  )}
                </div>
                <div className="col-6">
                  <p className="text-muted small mb-1">Ảnh chân dung xác thực</p>
                  {selectedReq.selfieImage ? (
                    selectedReq.selfieImage.startsWith('data:video') ? (
                      <video src={selectedReq.selfieImage} controls autoPlay loop className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%', transform: "scaleX(-1)" }}></video>
                    ) : (
                      <img src={selectedReq.selfieImage} alt="Selfie" className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%', transform: "scaleX(-1)" }} />
                    )
                  ) : (
                     <div className="bg-secondary rounded d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                       No image
                     </div>
                  )}
                </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button className="btn-danger" onClick={() => handleReject(selectedReq.id)}>Từ chối</Button>
              <Button className="btn-success" onClick={() => handleApprove(selectedReq.id)}>Phê duyệt (Cấp tick xanh)</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminVerificationsView;


