import React, { useState, useEffect } from 'react';
import { User } from '../../models';

interface CallModalProps {
  user: User;
  isVideo: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ user, isVideo, onClose }) => {
  const [callState, setCallState] = useState<'calling' | 'connected'>('calling');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate answering after 3 seconds
    const timer = setTimeout(() => {
      setCallState('connected');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}>
      <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-centered">
        <div className="modal-content bg-dark text-white border-0 shadow-lg rounded-4 overflow-hidden" style={{ minHeight: '500px' }}>
          
          {isVideo && callState === 'connected' ? (
            <div className="position-relative h-100 w-100 d-flex align-items-center justify-content-center bg-black">
              {/* Fake remote video (just a placeholder avatar or gradient) */}
              <img src={user.avatar || 'https://via.placeholder.com/150'} alt="Remote" className="w-100 h-100 object-fit-cover opacity-75" />
              
              {/* Fake local video (PiP) */}
              <div className="position-absolute bottom-0 end-0 m-3 m-md-4 rounded-3 overflow-hidden border border-2 border-white shadow" style={{ width: '100px', height: '150px', backgroundColor: '#333' }}>
                 <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary">
                   <i className="bi bi-person-fill text-light fs-1"></i>
                 </div>
              </div>
            </div>
          ) : (
            <div className="modal-body d-flex flex-column align-items-center justify-content-center text-center p-5">
              <div className="position-relative mb-4">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/150'} 
                  alt={user.firstName}
                  className="rounded-circle shadow"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                {callState === 'calling' && (
                  <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 rounded-circle border border-primary border-3" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                )}
              </div>
              <h3 className="fw-bold mb-1">{user.firstName} {user.lastName}</h3>
              <p className="text-white-50 mb-0 fs-5">
                {callState === 'calling' ? (isVideo ? 'Đang gọi video...' : 'Đang gọi thoại...') : formatDuration(callDuration)}
              </p>
            </div>
          )}

          <div className="position-absolute bottom-0 start-50 translate-middle-x w-100 p-4 pb-5 d-flex justify-content-center gap-4" style={{ background: isVideo && callState === 'connected' ? 'linear-gradient(transparent, rgba(0,0,0,0.8))' : 'transparent' }}>
            {callState === 'connected' && (
              <>
                <button className="btn btn-secondary rounded-circle shadow-sm" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-mic-mute-fill fs-4"></i>
                </button>
                {isVideo && (
                  <button className="btn btn-secondary rounded-circle shadow-sm" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-camera-video-off-fill fs-4"></i>
                  </button>
                )}
              </>
            )}
            <button className="btn btn-danger rounded-circle shadow-lg" style={{ width: '60px', height: '60px' }} onClick={onClose}>
              <i className="bi bi-telephone-x-fill fs-3"></i>
            </button>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
