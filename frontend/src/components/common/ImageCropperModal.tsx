import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from './Modal';
import Button from './Button';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  aspect?: number;
  circularCrop?: boolean;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspect = 1,
  circularCrop = false
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = () => {
    if (!imgRef.current || !completedCrop) {
      // Nếu chưa crop, cứ lưu ảnh gốc hoặc báo lỗi
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    if (circularCrop) {
      ctx.beginPath();
      ctx.arc(
        completedCrop.width / 2,
        completedCrop.height / 2,
        Math.min(completedCrop.width, completedCrop.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.clip();
    }

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Dùng PNG để giữ nền trong suốt nếu cắt hình tròn
    const base64Image = canvas.toDataURL(circularCrop ? 'image/png' : 'image/jpeg', 0.9);
    onCropComplete(base64Image);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cắt ảnh">
      <div className="d-flex flex-column align-items-center">
        <ReactCrop 
          crop={crop} 
          onChange={c => setCrop(c)} 
          onComplete={c => setCompletedCrop(c)}
          aspect={aspect}
          circularCrop={circularCrop}
          className="mb-3"
        >
          <img 
            ref={imgRef}
            src={imageSrc} 
            alt="Crop me" 
            style={{ maxHeight: '60vh', maxWidth: '100%' }}
          />
        </ReactCrop>
        
        <div className="d-flex justify-content-end gap-2 w-100 mt-3">
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={handleSave}>Lưu ảnh</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
