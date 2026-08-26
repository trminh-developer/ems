import React, { useState, useRef } from 'react';
import { Avatar, Button } from '../common';
import { useAuth } from '../../hooks';
import { useFeed } from '../../hooks';

export const CreateStatus: React.FC = () => {
  const { user } = useAuth();
  const { createStatus, isUploading } = useFeed();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    const urlToRemove = previewUrls[index];
    URL.revokeObjectURL(urlToRemove);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return;
    
    const success = await createStatus(content, files);
    if (success) {
      setContent('');
      setFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    }
  };

  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex">
          <Avatar src={user?.avatar || ''} alt={user?.firstName} size="md" />
          <textarea
            className="form-control border-0 ms-2"
            placeholder={`Bạn đang nghĩ gì thế, ${user?.firstName || 'bạn'}?`}
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ resize: 'none', backgroundColor: '#f8f9fa' }}
          ></textarea>
        </div>

        {/* Media Preview */}
        {previewUrls.length > 0 && (
          <div className="mt-3 d-flex flex-wrap gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="position-relative">
                <img src={url} alt={`preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
                <button 
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-1"
                  style={{ width: '24px', height: '24px', lineHeight: '1', transform: 'translate(30%, -30%)' }}
                  onClick={() => handleRemoveFile(index)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <hr />
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              className="d-none" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button variant="outline" className="me-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <i className="bi bi-image text-success me-2"></i>
              Ảnh/Video
            </Button>
          </div>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={(!content.trim() && files.length === 0) || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang đăng...
              </>
            ) : 'Đăng'}
          </Button>
        </div>
      </div>
    </div>
  );
};
