import React, { useState } from 'react';

interface IconMenuProps {
  onSelectIcon: (icon: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
  onSelectGif: (gifUrl: string) => void;
  onClose: () => void;
}

export const IconMenu: React.FC<IconMenuProps> = ({ 
  onSelectIcon,
  onSelectSticker,
  onSelectGif,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'icon' | 'sticker' | 'gif'>('icon');

  const icons = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '🙏', '❤️', '🔥', '🎉', '✨'];
  const stickers = [
    'https://cdn-icons-png.flaticon.com/128/4860/4860867.png',
    'https://cdn-icons-png.flaticon.com/128/4860/4860773.png',
    'https://cdn-icons-png.flaticon.com/128/4860/4860803.png'
  ];
  const gifs = [
    'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    'https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif'
  ];

  return (
    <div className="position-absolute bottom-100 mb-2 bg-white rounded shadow-sm border" style={{ minWidth: '250px', zIndex: 1050, left: '40px' }}>
      <div className="d-flex border-bottom">
        <button 
          type="button"
          className={`btn btn-sm flex-fill rounded-0 ${activeTab === 'icon' ? 'btn-light border-bottom border-primary border-2' : 'btn-white'}`}
          onClick={() => setActiveTab('icon')}
        >
          Icon
        </button>
        <button 
          type="button"
          className={`btn btn-sm flex-fill rounded-0 ${activeTab === 'sticker' ? 'btn-light border-bottom border-primary border-2' : 'btn-white'}`}
          onClick={() => setActiveTab('sticker')}
        >
          Nhãn dán
        </button>
        <button 
          type="button"
          className={`btn btn-sm flex-fill rounded-0 ${activeTab === 'gif' ? 'btn-light border-bottom border-primary border-2' : 'btn-white'}`}
          onClick={() => setActiveTab('gif')}
        >
          GIF
        </button>
      </div>

      <div className="p-2" style={{ height: '150px', overflowY: 'auto' }}>
        {activeTab === 'icon' && (
          <div className="d-flex flex-wrap gap-2">
            {icons.map((icon, i) => (
              <span 
                key={i} 
                className="fs-4 cursor-pointer" 
                onClick={() => { onSelectIcon(icon); onClose(); }}
                style={{ cursor: 'pointer' }}
              >
                {icon}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'sticker' && (
          <div className="d-flex flex-wrap gap-2">
            {stickers.map((sticker, i) => (
              <img 
                key={i} 
                src={sticker} 
                alt="sticker" 
                width="60" 
                height="60" 
                onClick={() => { onSelectSticker(sticker); onClose(); }}
                style={{ cursor: 'pointer', objectFit: 'contain' }}
              />
            ))}
          </div>
        )}

        {activeTab === 'gif' && (
          <div className="d-flex flex-wrap gap-2">
            {gifs.map((gif, i) => (
              <img 
                key={i} 
                src={gif} 
                alt="gif" 
                width="100" 
                onClick={() => { onSelectGif(gif); onClose(); }}
                style={{ cursor: 'pointer', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
