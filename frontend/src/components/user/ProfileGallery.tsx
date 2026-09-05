import React from 'react';

interface ProfileGalleryProps {
  photos: string[];
}

export const ProfileGallery: React.FC<ProfileGalleryProps> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="profile-gallery container-fluid p-0">
      <div className="row g-2">
        {photos.map((photo, index) => (
          <div key={index} className="col-4 col-md-3">
            <div className="ratio ratio-1x1 rounded-3 overflow-hidden bg-light shadow-sm">
              <img src={photo} alt={`Gallery photo ${index + 1}`} className="w-100 h-100 object-fit-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
