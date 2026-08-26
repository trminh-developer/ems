import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services';
import { User } from '../models';
import { UserCard } from '../components/user';
import { Loading, EmptyState } from '../components/common';

const LikesView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'likedMe' | 'iLiked'>('likedMe');
  const [likedMeUsers, setLikedMeUsers] = useState<User[]>([]);
  const [iLikedUsers, setILikedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      try {
        const [likedMe, iLiked] = await Promise.all([
          matchService.getWhoLikedMe(),
          matchService.getWhoILiked()
        ]);
        setLikedMeUsers(likedMe);
        setILikedUsers(iLiked);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikes();
  }, []);

  return (
    <div className="likes-view fade-in">
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group shadow-sm" role="group">
          <button 
            type="button" 
            className={`btn ${activeTab === 'likedMe' ? 'btn-hc-primary text-white' : 'btn-light'}`}
            onClick={() => setActiveTab('likedMe')}
          >
            Người đã thích bạn ({likedMeUsers.length})
          </button>
          <button 
            type="button" 
            className={`btn ${activeTab === 'iLiked' ? 'btn-hc-primary text-white' : 'btn-light'}`}
            onClick={() => setActiveTab('iLiked')}
          >
            Người bạn đã thích ({iLikedUsers.length})
          </button>
        </div>
      </div>

      <div className="hc-card p-4">
        {isLoading ? (
          <Loading text="Đang tải danh sách..." />
        ) : (
          <>
            {activeTab === 'likedMe' && (
              <div className="row">
                {likedMeUsers.length > 0 ? (
                  likedMeUsers.map(u => (
                    <div key={u.id} className="col-md-3 col-6 mb-3">
                      <div className="position-relative">
                        {/* Fake Blur cho tính năng Premium */}
                        <div className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark z-3">
                          <i className="bi bi-star-fill me-1"></i> Mới
                        </div>
                        <UserCard user={u} onClick={() => navigate(`/profile/${u.username || u.id}`)} />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="bi bi-heartbreak" 
                    title="Chưa có ai thích bạn" 
                    description="Hãy cập nhật hồ sơ để thu hút thêm sự chú ý nhé!" 
                  />
                )}
              </div>
            )}

            {activeTab === 'iLiked' && (
              <div className="row">
                {iLikedUsers.length > 0 ? (
                  iLikedUsers.map(u => (
                    <div key={u.id} className="col-md-3 col-6 mb-3">
                      <UserCard user={u} onClick={() => navigate(`/profile/${u.username || u.id}`)} />
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon="bi bi-emoji-frown" 
                    title="Bạn chưa thích ai" 
                    description="Quay lại trang Khám phá để thả tim cho những người bạn quan tâm." 
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LikesView;
