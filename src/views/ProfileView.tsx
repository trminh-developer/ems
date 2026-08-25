import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileHeader, ProfileGallery, InterestBadge } from '../components/user';
import { Button, Loading } from '../components/common';
import { useAuth } from '../hooks/useAuth';

const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOwnProfile = !id || id === currentUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    // Mock user fetching
    setTimeout(() => {
      setUser(isOwnProfile ? currentUser : { id, firstName: 'Bob', lastName: 'Smith', bio: 'Hello world', interests: ['Music', 'Travel'] });
      setIsLoading(false);
    }, 500);
  }, [id, isOwnProfile, currentUser]);

  if (isLoading) return <Loading text="Đang tải hồ sơ..." />;
  if (!user) return <div>Không tìm thấy người dùng.</div>;

  return (
    <div className="profile-view fade-in">
      <ProfileHeader user={user} />
      
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <div className="hc-card p-4">
            <h5 className="mb-3">Bio</h5>
            <p>{user.bio || 'Chưa có thông tin.'}</p>
            
            <h5 className="mb-3 mt-4">Sở thích</h5>
            <div className="d-flex flex-wrap gap-2">
              {user.interests?.map((interest: any, i: number) => (
                <InterestBadge key={i} interest={typeof interest === 'string' ? { id: String(i), name: interest, icon: 'bi-star' } as any : interest} />
              )) || <span className="text-muted">Chưa cập nhật</span>}
            </div>

            <div className="mt-4">
              {isOwnProfile ? (
                <Button className="btn-outline-primary w-100">Chỉnh sửa hồ sơ</Button>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Button className="btn-hc-primary">Nhắn tin</Button>
                  <Button className="btn-outline-danger">Chặn</Button>
                  <Button className="btn-outline-secondary">Báo cáo</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="hc-card p-4">
            <h5 className="mb-3">Thư viện ảnh</h5>
            <ProfileGallery photos={user.photos || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
