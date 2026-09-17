import React, { useRef } from 'react';

interface AttachmentMenuProps {
  onSelectImage: (file: File) => void;
  onSelectVideo: (file: File) => void;
  onSelectLocation: () => void;
  onClose: () => void;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ 
  onSelectImage, 
  onSelectVideo, 
  onSelectLocation,
  onClose
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectImage(file);
      onClose();
    }
    e.target.value = '';
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectVideo(file);
      onClose();
    }
    e.target.value = '';
  };

  return (
    <div className="position-absolute bottom-100 start-0 mb-2 bg-white rounded shadow-sm border p-2" style={{ minWidth: '200px', zIndex: 1050 }}>
      <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
      <input type="file" ref={videoInputRef} style={{ display: 'none' }} accept="video/*" onChange={handleVideoChange} />
      
      <div className="d-flex flex-column gap-1">
        <button 
          type="button" 
          className="btn btn-light text-start d-flex align-items-center gap-2 border-0"
          onClick={() => imageInputRef.current?.click()}
        >
          <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-image"></i>
          </div>
          Hình ảnh
        </button>
        
        <button 
          type="button" 
          className="btn btn-light text-start d-flex align-items-center gap-2 border-0"
          onClick={() => videoInputRef.current?.click()}
        >
          <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-camera-video"></i>
          </div>
          Video
        </button>

        <button 
          type="button" 
          className="btn btn-light text-start d-flex align-items-center gap-2 border-0"
          onClick={() => {
            onSelectLocation();
            onClose();
          }}
        >
          <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-geo-alt"></i>
          </div>
          Vị trí
        </button>
      </div>
    </div>
  );
};
