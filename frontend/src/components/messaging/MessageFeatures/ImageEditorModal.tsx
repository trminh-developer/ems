import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../../common';

interface ImageEditorModalProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onSend: (editedImageBase64: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, file, onClose, onSend }) => {
  const [activeTool, setActiveTool] = useState<'crop' | 'draw' | 'text'>('crop');
  const [color, setColor] = useState('#ff0000');
  const [textStyle, setTextStyle] = useState({ bold: false, italic: false, underline: false });
  const [preview, setPreview] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setPreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSend = () => {
    // In a real app, we'd get the modified canvas data
    // For now, just send the original/preview
    onSend(preview);
    onClose();
  };

  if (!file) return null;

  return (
    <Modal isOpen={isOpen} title="Chỉnh sửa hình ảnh" onClose={onClose}>
      <div className="d-flex flex-column gap-3">
        {/* Toolbar */}
        <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${activeTool === 'crop' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTool('crop')}
            >
              <i className="bi bi-crop me-1"></i> Cắt ảnh
            </button>
            <button 
              className={`btn btn-sm ${activeTool === 'draw' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTool('draw')}
            >
              <i className="bi bi-pencil me-1"></i> Vẽ
            </button>
            <button 
              className={`btn btn-sm ${activeTool === 'text' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTool('text')}
            >
              <i className="bi bi-fonts me-1"></i> Text
            </button>
          </div>

          {activeTool === 'draw' && (
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="form-control form-control-color" />
          )}

          {activeTool === 'text' && (
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${textStyle.bold ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setTextStyle(s => ({ ...s, bold: !s.bold }))}
              >
                <b>B</b>
              </button>
              <button 
                className={`btn btn-sm ${textStyle.italic ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setTextStyle(s => ({ ...s, italic: !s.italic }))}
              >
                <i>I</i>
              </button>
              <button 
                className={`btn btn-sm ${textStyle.underline ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setTextStyle(s => ({ ...s, underline: !s.underline }))}
              >
                <u>U</u>
              </button>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="form-control form-control-color ms-2" />
            </div>
          )}
        </div>

        {/* Editor Area (Mockup) */}
        <div className="bg-dark rounded d-flex justify-content-center align-items-center" style={{ minHeight: '400px', overflow: 'hidden' }}>
          {preview && (
            <img src={preview} alt="Edit preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleSend}>
            <i className="bi bi-send-fill me-2"></i> Gửi ảnh
          </button>
        </div>
      </div>
    </Modal>
  );
};
