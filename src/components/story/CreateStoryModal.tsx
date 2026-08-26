import React, { useState, useRef } from 'react';
import { Modal, Button, Loading } from '../common';
import { supabase } from '../../config/supabase';
import { storyService } from '../../services';
import { useAuth } from '../../hooks/useAuth';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose, onStoryCreated }) => {
  const { user } = useAuth();
  const [type, setType] = useState<'image' | 'video' | 'text'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState('#ff6b6b');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      if (selectedFile.type.startsWith('video/')) {
        setType('video');
      } else {
        setType('image');
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (type !== 'text' && !file) return;
    if (type === 'text' && !textContent.trim()) return;

    setIsSubmitting(true);
    try {
      let mediaUrl = undefined;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `story_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `stories/${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('status_media') // Tái sử dụng bucket này
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('status_media')
          .getPublicUrl(filePath);
          
        mediaUrl = publicUrl;
      }
      
      await storyService.createStory(user.id, type, mediaUrl, type === 'text' ? textContent : undefined, type === 'text' ? bgColor : undefined);
      
      onStoryCreated();
      resetForm();
      onClose();
    } catch (error: any) {
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl('');
    setTextContent('');
    setType('image');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Tin (Story) mới">
      <div className="d-flex gap-2 mb-3">
        <button 
          className={`btn flex-grow-1 ${type !== 'text' ? 'btn-hc-primary' : 'btn-outline-secondary'}`}
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
        >
          <i className="bi bi-image me-2"></i> Ảnh/Video
        </button>
        <button 
          className={`btn flex-grow-1 ${type === 'text' ? 'btn-hc-primary' : 'btn-outline-secondary'}`}
          onClick={() => setType('text')}
        >
          <i className="bi bi-type me-2"></i> Văn bản
        </button>
      </div>

      <input 
        type="file" 
        accept="image/*,video/mp4,video/quicktime" 
        className="d-none" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <div className="story-preview-container bg-dark rounded-3 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden mb-3" style={{ height: '400px', backgroundColor: type === 'text' ? bgColor : '#222' }}>
        {type === 'text' ? (
          <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center p-4 text-center" style={{ backgroundColor: bgColor }}>
            <textarea
              className="form-control bg-transparent text-white border-0 text-center fw-bold fs-3"
              style={{ resize: 'none', outline: 'none', boxShadow: 'none' }}
              placeholder="Nhập nội dung..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={4}
            />
            <div className="position-absolute bottom-0 mb-3 d-flex gap-2">
              {['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#845ef7'].map(color => (
                <button 
                  key={color} 
                  className="rounded-circle border-0" 
                  style={{ width: '30px', height: '30px', backgroundColor: color, border: bgColor === color ? '2px solid white' : 'none' }}
                  onClick={() => setBgColor(color)}
                />
              ))}
            </div>
          </div>
        ) : previewUrl ? (
          type === 'video' ? (
            <video src={previewUrl} controls className="w-100 h-100 object-fit-contain" />
          ) : (
            <img src={previewUrl} alt="Preview" className="w-100 h-100 object-fit-contain" />
          )
        ) : (
          <div className="text-white text-center">
            <i className="bi bi-plus-circle fs-1 mb-2"></i>
            <p>Chọn ảnh hoặc video để hiển thị</p>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || (type !== 'text' && !file) || (type === 'text' && !textContent.trim())}>
          {isSubmitting ? <Loading text="Đang đăng..." /> : 'Đăng Tin'}
        </Button>
      </div>
    </Modal>
  );
};
