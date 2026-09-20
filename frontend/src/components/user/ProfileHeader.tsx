import React from 'react';
import { User } from '../../models';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { calculateAge } from '../../utils/helpers';
import { ImageViewerModal } from '../common';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile, onEdit, onLike, onMessage }) => {
  const age = calculateAge(user.dateOfBirth);
  const [viewImageSrc, setViewImageSrc] = React.useState<string | null>(null);

  return (
    <div className="profile-header bg-white shadow-sm rounded-bottom-4 mb-4 overflow-hidden mx-auto" style={{ maxWidth: '95%' }}>
      <div 
        className="profile-cover w-100 bg-secondary"
        onClick={() => { if (user.coverPhoto) setViewImageSrc(user.coverPhoto); }}
        style={{ cursor: user.coverPhoto ? 'zoom-in' : 'default',
          height: '280px', 
          backgroundImage: user.coverPhoto ? `url(${user.coverPhoto})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="px-4 pb-4 position-relative">
        <div className="profile-avatar-wrapper position-absolute rounded-circle" style={{ top: '-60px', left: '20px' }}>
          <div onClick={() => { if (user.avatar) setViewImageSrc(user.avatar); }} style={{ cursor: user.avatar ? 'zoom-in' : 'default' }}>
            <Avatar src={user.avatar || ''} alt={(user.firstName || user.username)} size="xl" />
          </div>
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
            </>
          )}
        </div>

        <div className="profile-info mt-2">
          <h2 className="mb-1 fw-bold d-flex align-items-center gap-2">
            {(user.firstName || user.username)} {(user.lastName || '')}, {age}
            {user.isVerified && <i className="bi bi-patch-check-fill text-primary fs-5"></i>}
          </h2>
          
          <div className="text-muted d-flex flex-wrap gap-3 mb-3">
            {user.location && (user.location?.city || user.location?.country) && (
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-geo-alt"></i> 
                {user.location?.city}{user.location?.city && user.location?.country ? ', ' : ''}{user.location?.country}
              </span>
            )}
            {user.profession && <span className="d-flex align-items-center gap-1"><i className="bi bi-briefcase"></i> {user.profession}</span>}
            {user.education && <span className="d-flex align-items-center gap-1"><i className="bi bi-book"></i> {user.education}</span>}
          </div>
        </div>
      </div>
      <ImageViewerModal isOpen={!!viewImageSrc} src={viewImageSrc} onClose={() => setViewImageSrc(null)} />
    </div>
  );
};
