import React, { useState } from 'react';
import { Status } from '../../models';
import { Avatar, Button, Input } from '../common';
import { useAlert } from '../../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import UserBadge from '../user/UserBadge';

interface StatusCardProps {
  status: Status;
  onLike: (id: string) => void;
  onComment: (id: string, content: string) => Promise<any>;
  getComments: (id: string) => Promise<any[]>;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, onLike, onComment, getComments }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentsLoaded, setIsCommentsLoaded] = useState(false);
  
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleToggleComments = async () => {
    if (!showComments && !isCommentsLoaded) {
      try {
        const data = await getComments(status.id);
        setComments(data);
        setIsCommentsLoaded(true);
      } catch (error: any) {
        showAlert(error.response?.data?.error || 'Không thể tải bình luận.', 'error');
        return;
      }
    }
    setShowComments(!showComments);
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await onComment(status.id, commentText);
      if (newComment) {
        setComments(previous => [...previous, newComment]);
        setCommentText('');
      }
    } catch (error: any) {
      showAlert(error.response?.data?.error || 'Không thể gửi bình luận.', 'error');
    }
  };

  const handleShare = () => {
    // Basic share behavior
    if (navigator.share) {
      navigator.share({
        title: `Bài viết của ${status.user?.firstName}`,
        text: status.content,
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    // In a real app, this might be a link directly to the post, but for now we'll copy current URL
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết!');
  };

  const author = status.user || (status as any).User || {};
  const authorName = `${author.firstName || author.first_name || author.username || 'Người dùng'} ${author.lastName || author.last_name || ''}`.trim();
  const authorAvatar = author.avatar || '';

  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <div className="cursor-pointer" onClick={() => navigate(`/profile/${author.username || author.id}`)}>
            <Avatar src={authorAvatar} alt={authorName} size="md" />
          </div>
          <div className="ms-2">
            <h6 className="mb-0 cursor-pointer" onClick={() => navigate(`/profile/${author.username || author.id}`)}>
              {authorName}
              <UserBadge user={author} />
            </h6>
            <small className="text-muted">
              {new Date(status.createdAt || (status as any).created_at || Date.now()).toLocaleString('vi-VN')}
            </small>
          </div>
          
          {/* Options Dropdown */}
          <div className="ms-auto position-relative">
            <button 
              className="btn btn-link text-muted p-1 text-decoration-none" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <i className="bi bi-three-dots fs-5"></i>
            </button>
            
            {showDropdown && (
              <>
                {/* Overlay to close dropdown when clicking outside */}
                <div 
                  className="position-fixed top-0 start-0 w-100 h-100" 
                  style={{ zIndex: 999 }} 
                  onClick={() => setShowDropdown(false)}
                ></div>
                
                {/* Dropdown Menu */}
                <div className="dropdown-menu show position-absolute end-0 mt-1 shadow border-0 rounded-3" style={{ zIndex: 1000, minWidth: '220px' }}>
                  <button className="dropdown-item py-2 d-flex align-items-center gap-2" onClick={() => { setShowDropdown(false); alert('Chức năng Chỉnh sửa đang được phát triển') }}>
                    <i className="bi bi-pencil text-primary"></i> Chỉnh sửa bài viết
                  </button>
                  <button className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger" onClick={() => { setShowDropdown(false); alert('Chức năng Xóa đang được phát triển') }}>
                    <i className="bi bi-trash"></i> Xóa bài viết
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item py-2 d-flex align-items-center gap-2" onClick={() => { setShowDropdown(false); alert('Đã lưu bài viết vào mục Đã lưu!') }}>
                    <i className="bi bi-bookmark-fill text-warning"></i> Lưu bài viết
                  </button>
                  <button className="dropdown-item py-2 d-flex align-items-center gap-2" onClick={() => { setShowDropdown(false); alert('Đã gửi báo cáo cho quản trị viên.') }}>
                    <i className="bi bi-flag text-secondary"></i> Báo cáo bài viết
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="card-text">{status.content}</p>

        {/* Media */}
        {status.mediaUrls && status.mediaUrls.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {status.mediaUrls.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt="Status media" 
                className="img-fluid rounded" 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            ))}
          </div>
        )}

        <hr />

        {/* Actions */}
        <div className="d-flex justify-content-between text-muted mb-2 px-2">
          <small>{status.likesCount} Thích</small>
          <small>{status.commentsCount} Bình luận</small>
        </div>

        <div className="d-flex justify-content-between border-top border-bottom py-1 mb-3">
          <Button 
            variant="text" 
            className={`flex-grow-1 ${status.hasLiked ? 'text-primary' : 'text-muted'}`} 
            onClick={() => onLike(status.id)}
          >
            <i className={`bi ${status.hasLiked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
            Thích
          </Button>
          <Button variant="text" className="text-muted flex-grow-1" onClick={handleToggleComments}>
            <i className="bi bi-chat me-1"></i>
            Bình luận
          </Button>
          <Button variant="text" className="text-muted flex-grow-1" onClick={handleShare}>
            <i className="bi bi-share me-1"></i>
            Chia sẻ
          </Button>
          <Button variant="text" className="text-muted flex-grow-1" onClick={handleCopyLink}>
            <i className="bi bi-link-45deg me-1"></i>
            Copy Link
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section mt-3">
              <div className="d-flex align-items-end mb-3 gap-2">
                <textarea 
                  className="hc-input form-control flex-grow-1"
                  placeholder="Viết bình luận..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePostComment();
                    }
                  }}
                  rows={2}
                  style={{ resize: 'none' }}
                />
                <Button variant="primary" onClick={handlePostComment} className="mb-0" style={{ height: 'fit-content' }}>
                  Gửi
                </Button>
              </div>
            
            <div className="comments-list">
              {comments.map((comment, index) => {
                const commentAuthor = comment.user || comment.User || {};
                const commentAuthorName = `${commentAuthor.firstName || commentAuthor.first_name || commentAuthor.username || 'Người dùng'} ${commentAuthor.lastName || commentAuthor.last_name || ''}`.trim();
                return (
                  <div key={index} className="d-flex mb-3">
                    <Avatar src={commentAuthor.avatar || ''} alt={commentAuthorName} size="sm" />
                    <div className="ms-2 flex-grow-1 bg-light p-2 rounded">
                      <h6 className="mb-0 fs-6">{commentAuthorName}<UserBadge user={commentAuthor} /></h6>
                      <p className="mb-0 small">{comment.content}</p>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {new Date(comment.createdAt || comment.created_at || Date.now()).toLocaleString('vi-VN')}
                      </small>
                    </div>
                  </div>
                );
              })}
              {comments.length === 0 && (
                <p className="text-center text-muted small">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
