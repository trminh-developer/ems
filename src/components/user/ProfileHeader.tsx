import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { calculateAge } from '../../utils/helpers';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onEdit, onLike, onMessage }) => {
  const age = calculateAge(user.dateOfBirth);

  return (
    <div className="profile-header bg-white shadow-sm rounded-bottom-4 mb-4 overflow-hidden">
      <div 
        className="profile-cover w-100 bg-secondary" 
        style={{ 
          height: '200px', 
          backgroundImage: user.coverPhoto ? `url(${user.coverPhoto})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="px-4 pb-4 position-relative">
        <div className="profile-avatar-wrapper position-absolute rounded-circle" style={{ top: '-60px', left: '20px' }}>
          <Avatar src={user.avatar || ''} alt={user.firstName} size="xl" />
        </div>
        
        <div className="d-flex justify-content-end pt-3 pb-2 gap-2">
          {isOwnProfile ? (
            <Button variant="outline" onClick={onEdit}>
              <i className="bi bi-pencil me-2"></i> Edit Profile
            </Button>
          ) : (
            <>
              {onMessage && (
                <Button variant="outline" onClick={onMessage}>
                  <i className="bi bi-chat-dots"></i>
                </Button>
              )}
              {onLike && (
                <Button variant="primary" onClick={onLike}>
                  <i className="bi bi-heart-fill me-2"></i> Like
                </Button>
              )}
              
              <div className="dropdown">
                <button className="btn btn-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li><button className="dropdown-item text-danger" onClick={() => alert('Đã báo cáo người dùng này')}>Báo cáo (Report)</button></li>
                  <li><button className="dropdown-item" onClick={() => alert('Đã chặn người dùng này')}>Chặn (Block)</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-muted" onClick={() => alert('Đã hủy tương hợp')}>Hủy tương hợp (Unmatch)</button></li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="profile-info mt-2">
          <h2 className="mb-1 fw-bold d-flex align-items-center gap-2">
            {user.firstName} {user.lastName}, {age}
            {user.isVerified && <i className="bi bi-patch-check-fill text-primary fs-5"></i>}
          </h2>
          
          <div className="text-muted d-flex flex-wrap gap-3 mb-3">
            <span className="d-flex align-items-center gap-1"><i className="bi bi-geo-alt"></i> {user.location.city}, {user.location.country}</span>
            {user.profession && <span className="d-flex align-items-center gap-1"><i className="bi bi-briefcase"></i> {user.profession}</span>}
            {user.education && <span className="d-flex align-items-center gap-1"><i className="bi bi-book"></i> {user.education}</span>}
          </div>

          {user.bio && (
            <div className="mt-3">
              <h6 className="fw-bold mb-2">About Me</h6>
              <p className="text-dark mb-0" style={{ whiteSpace: 'pre-line' }}>{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
