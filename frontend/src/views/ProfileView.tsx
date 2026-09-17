import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileHeader, ProfileGallery, InterestBadge } from '../components/user';
import { Button, Loading, Modal, Input, Toast, ImageCropperModal, LinkifyText } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { useMatches } from '../hooks/useMatches';
import { useAlert } from '../contexts/AlertContext';
import { userService, authService, feedService } from '../services';
import { supabase } from '../config/supabase';
import { interests as predefinedInterests } from '../data';

const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const { showAlert } = useAlert();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    firstName: '', 
    lastName: '', 
    bio: '',
    city: '',
    country: '',
    profession: '',
    education: '',
    avatar: '',
    coverPhoto: '',
    dateOfBirth: '',
    interests: [] as any[],
    isVerified: false
  });
  const [newInterest, setNewInterest] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Crop states
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const [cropField, setCropField] = useState<'avatar' | 'coverPhoto' | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropAspect, setCropAspect] = useState(1);
  
  const isOwnProfile = !id || id === currentUser?.username || id === currentUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if (isOwnProfile && currentUser) {
          setUser(currentUser);
          setEditForm({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            bio: currentUser.bio || '',
            city: currentUser.location?.city || '',
            country: currentUser.location?.country || '',
            profession: currentUser.profession || '',
            education: currentUser.education || '',
            avatar: currentUser.avatar || '',
            coverPhoto: currentUser.coverPhoto || '',
            dateOfBirth: currentUser.dateOfBirth || '',
            interests: currentUser.interests || [],
            isVerified: currentUser.isVerified || false
          });
        } else if (id) {
          let fetchedUser = await userService.getUserByUsername(id);
          if (!fetchedUser) {
            fetchedUser = await userService.getUserById(id);
          }
          if (fetchedUser) setUser(fetchedUser);
        }
        
        // Fetch statuses to populate gallery
        const targetUserId = isOwnProfile && currentUser ? currentUser.id : (id || '');
        if (targetUserId) {
          const statuses = await feedService.getStatuses(targetUserId);
          const allPhotos = (statuses as any[]).reduce<string[]>((acc: string[], status: any) => {
            if (status.mediaUrls && status.mediaUrls.length > 0) {
              return [...acc, ...status.mediaUrls];
            }
            return acc;
          }, []);
          setGalleryPhotos(allPhotos);
        }

      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [id, isOwnProfile, currentUser]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'avatar' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('File quá lớn. Vui lòng chọn ảnh dưới 5MB.', 'error');
        return;
      }
      
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCropImageSrc(reader.result as string);
          setCropField(fieldName);
          // Set aspect ratio: 1:1 for avatar, roughly 3:1 for cover (chiều rộng ngắn 1 chút, chiều dài to hơn 1 xí)
          setCropAspect(fieldName === 'avatar' ? 1 : 2.5);
          setIsCropModalOpen(true);
          
          // Clear input so same file can be selected again
          e.target.value = '';
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        console.error(err);
        showAlert('Có lỗi xảy ra khi đọc ảnh!', 'error');
      }
    }
  };

  const handleCropComplete = (croppedBase64: string) => {
    if (cropField) {
      setEditForm({ ...editForm, [cropField]: croppedBase64 });
    }
    setIsCropModalOpen(false);
  };

  const guessIconForInterest = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('nhạc') || n.includes('hát') || n.includes('đàn') || n.includes('music')) return 'bi-music-note-beamed';
    if (n.includes('game') || n.includes('trò chơi')) return 'bi-controller';
    if (n.includes('sách') || n.includes('đọc') || n.includes('book') || n.includes('truyện')) return 'bi-book';
    if (n.includes('thể thao') || n.includes('bóng') || n.includes('chạy') || n.includes('bơi')) return 'bi-activity';
    if (n.includes('nấu ăn') || n.includes('ăn') || n.includes('uống') || n.includes('cafe')) return 'bi-cup-hot';
    if (n.includes('du lịch') || n.includes('khám phá') || n.includes('phượt') || n.includes('travel')) return 'bi-airplane';
    if (n.includes('phim') || n.includes('movie') || n.includes('cinema')) return 'bi-film';
    if (n.includes('chụp ảnh') || n.includes('ảnh') || n.includes('photo') || n.includes('camera')) return 'bi-camera';
    if (n.includes('code') || n.includes('lập trình') || n.includes('công nghệ') || n.includes('tech')) return 'bi-laptop';
    if (n.includes('mua sắm') || n.includes('shop')) return 'bi-bag-heart';
    if (n.includes('thú cưng') || n.includes('chó') || n.includes('mèo') || n.includes('pet')) return 'bi-balloon-heart';
    if (n.includes('ngủ') || n.includes('sleep')) return 'bi-moon-stars';
    
    // Default fallback icon
    return 'bi-star';
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const interestObj = {
        id: Date.now().toString(),
        name: newInterest.trim(),
        icon: guessIconForInterest(newInterest.trim()),
        category: 'lifestyle'
      };
      setEditForm({ ...editForm, interests: [...editForm.interests, interestObj] });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (id: string) => {
    setEditForm({ ...editForm, interests: editForm.interests.filter(i => i.id !== id) });
  };

  const handleAddPredefinedInterest = (interest: any) => {
    setEditForm({ ...editForm, interests: [...editForm.interests, interest] });
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser({ 
        ...currentUser, 
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio,
        profession: editForm.profession,
        education: editForm.education,
        avatar: editForm.avatar,
        coverPhoto: editForm.coverPhoto,
        dateOfBirth: editForm.dateOfBirth,
        interests: editForm.interests,
        isVerified: editForm.isVerified,
        location: {
          ...currentUser.location,
          city: editForm.city,
          country: editForm.country
        }
      });
      setIsEditModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const { conversations, selectConversation, loadConversations } = useChat();

  const { likeUser } = useMatches();

  const existingConv = conversations?.find(c => 
    c.participants.some(p => p.id === user?.id)
  );
  const isMatched = !!existingConv;

  // Handle message button click
  const handleMessage = () => {
    if (!user) return;
    if (existingConv) {
      selectConversation(existingConv.id);
      navigate('/messages');
    } else {
      showAlert('Bạn và người này chưa kết đôi. Hãy thả tim trước nhé!', 'warning');
    }
  };

  const handleLike = async () => {
    if (!user) return;
    await likeUser(user.id);
    showAlert('Đã thả tim và tương hợp thành công! 💕 Bây giờ bạn có thể nhắn tin.', 'success');
    if (loadConversations) await loadConversations();
  };

  if (isLoading) return <Loading text="Đang tải hồ sơ..." />;
  if (!user) return <div>Không tìm thấy người dùng.</div>;

  return (
    <div className="profile-view fade-in position-relative">
      <ProfileHeader user={user} />
      
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <div className="hc-card p-4">
            <h5 className="mb-3">Bio</h5>
            <div className="text-dark">
              <LinkifyText text={user.bio || 'Chưa có thông tin.'} />
            </div>
            
            <h5 className="mb-3 mt-4">Sở thích</h5>
            <div className="d-flex flex-wrap gap-2">
              {user.interests?.map((interest: any, i: number) => (
                <InterestBadge key={i} interest={typeof interest === 'string' ? { id: String(i), name: interest, icon: 'bi-star' } as any : interest} />
              )) || <span className="text-muted">Chưa cập nhật</span>}
            </div>

            <div className="mt-4">
              {isOwnProfile ? (
                <Button variant="primary" className="w-100" onClick={() => setIsEditModalOpen(true)}>
                  Chỉnh sửa hồ sơ
                </Button>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {isMatched ? (
                    <Button variant="light" disabled className="text-danger border-danger">
                      <i className="bi bi-heart-fill me-2"></i> Đã tương hợp
                    </Button>
                  ) : (
                    <Button variant="danger" onClick={handleLike}><i className="bi bi-heart-fill me-2"></i> Thả tim</Button>
                  )}
                  <Button variant="primary" onClick={handleMessage}>Nhắn tin</Button>
                  <Button variant="secondary" onClick={() => showAlert('Đã chặn người dùng này.', 'info')}>Chặn</Button>
                  <Button variant="warning" onClick={() => showAlert('Đã gửi báo cáo vi phạm!', 'warning')}>Báo cáo</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {galleryPhotos && galleryPhotos.length > 0 && (
            <div className="hc-card p-4">
              <h5 className="mb-3">Thư viện ảnh</h5>
              <ProfileGallery photos={galleryPhotos} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        title="Chỉnh sửa toàn bộ hồ sơ" 
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tên</label>
            <input type="text" className="form-control" name="firstName" value={editForm.firstName} onChange={handleEditChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Họ</label>
            <input type="text" className="form-control" name="lastName" value={editForm.lastName} onChange={handleEditChange} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Ngày sinh (Dùng để tính tuổi)</label>
          <input 
            type="date" 
            className="form-control" 
            name="dateOfBirth" 
            value={editForm.dateOfBirth} 
            onChange={handleEditChange} 
            max={new Date().toISOString().split("T")[0]} // Không cho phép chọn ngày tương lai
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Input label="Thành phố" name="city" value={editForm.city} onChange={handleEditChange} />
          </div>
          <div className="col-md-6 mb-3">
            <Input label="Quốc gia" name="country" value={editForm.country} onChange={handleEditChange} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Input label="Nghề nghiệp" name="profession" value={editForm.profession} onChange={handleEditChange} />
          </div>
          <div className="col-md-6 mb-3">
            <Input label="Học vấn" name="education" value={editForm.education} onChange={handleEditChange} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh đại diện (Avatar)</label>
          <div className="d-flex align-items-center gap-3">
            {editForm.avatar && (
              <img src={editForm.avatar} alt="Avatar" className="rounded-circle border" style={{ width: 50, height: 50, objectFit: 'cover' }} />
            )}
            <input 
              type="file" 
              className="form-control" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'avatar')} 
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh bìa (Cover)</label>
          <div className="d-flex flex-column gap-2">
            {editForm.coverPhoto && (
              <img src={editForm.coverPhoto} alt="Cover" className="rounded border" style={{ width: '80%', height: '140px', objectFit: 'cover', margin: '0 auto' }} />
            )}
            <input 
              type="file" 
              className="form-control" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'coverPhoto')} 
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Sở thích của bạn</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {editForm.interests.map(interest => (
              <span key={interest.id} className="interest-badge d-flex align-items-center gap-1">
                <i className={`bi ${interest.icon}`}></i> {interest.name}
                <i className="bi bi-x-circle-fill ms-1 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveInterest(interest.id)}></i>
              </span>
            ))}
          </div>
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tự nhập sở thích mới..." 
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? handleAddInterest() : null}
            />
            <button className="btn btn-outline-primary" type="button" onClick={handleAddInterest}>Thêm</button>
          </div>
          
          <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Gợi ý sở thích:</label>
          <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '150px', overflowY: 'auto', padding: '4px' }}>
            {predefinedInterests
              .filter(i => !editForm.interests.find((ei: any) => ei.id === i.id || ei.name.toLowerCase() === i.name.toLowerCase()))
              .map(interest => (
                <span 
                  key={interest.id} 
                  className="interest-badge interest-badge-light text-dark border d-flex align-items-center gap-1" 
                  style={{ cursor: 'pointer', background: '#f8f9fa' }}
                  onClick={() => handleAddPredefinedInterest(interest)}
                >
                  <i className={`bi ${interest.icon} text-primary`}></i> {interest.name}
                  <i className="bi bi-plus text-primary"></i>
                </span>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Bio (Giới thiệu ngắn)</label>
          <textarea 
            className="form-control" 
            name="bio" 
            rows={3} 
            value={editForm.bio} 
            onChange={handleEditChange}
            placeholder="Viết một vài điều về bản thân bạn..."
          />
        </div>
        
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSaveProfile}>Lưu thay đổi</Button>
        </div>
      </Modal>

      {/* Crop Modal */}
      {isCropModalOpen && cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          aspect={cropAspect}
        />
      )}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
        <Toast show={showToast} message="Đã cập nhật hồ sơ!" type="success" onClose={() => setShowToast(false)} />
      </div>
    </div>
  );
};

export default ProfileView;
