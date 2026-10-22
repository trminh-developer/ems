import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DiscoverCard, MatchModal } from '../components/dating';
import { Button, Loading, EmptyState, SEO, AuthPromptModal } from '../components/common';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { User } from '../models';

const DiscoverView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthPromptModal, setShowAuthPromptModal] = useState(false);
  const { likeUser, dislikeUser, superLikeUser, showMatchModal, newMatch, closeMatchModal } = useMatches();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const recommended = await userService.getRecommendedUsers(currentUser?.id || '');
        setUsers(recommended || []);
      } catch (error) {
        console.error('Error fetching recommended users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser?.id]);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleLike = async () => {
    if (!currentUser) {
      setShowAuthPromptModal(true);
      return;
    }
    const user = users[currentIndex];
    if (!user) return;
    try {
      await likeUser(user.id);
    } catch (err) {
      console.error('Error liking user:', err);
    }
    handleNext();
  };

  const handleDislike = async () => {
    if (!currentUser) {
      setShowAuthPromptModal(true);
      return;
    }
    const user = users[currentIndex];
    if (!user) return;
    try {
      await dislikeUser(user.id);
    } catch (err) {
      console.error('Error disliking user:', err);
    }
    handleNext();
  };

  const handleSuperLike = async () => {
    if (!currentUser) {
      setShowAuthPromptModal(true);
      return;
    }
    const user = users[currentIndex];
    if (!user) return;
    try {
      await superLikeUser(user.id);
    } catch (err) {
      console.error('Error superliking user:', err);
    }
    handleNext();
  };

  if (isLoading) return <Loading text={t('discover.loading')} />;

  const currentCard = currentIndex < users.length ? users[currentIndex] : null;

  return (
    <div className="discover-view fade-in d-flex flex-column align-items-center justify-content-center h-100 py-3">
      <SEO title={t('discover.title')} description={t('discover.seo_desc')} />
      {currentCard ? (
        <div className="discover-container d-flex flex-column align-items-center" style={{ maxWidth: '420px', width: '100%' }}>
          <DiscoverCard 
            user={currentCard} 
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperLike={handleSuperLike}
            onViewProfile={() => {
              if (!currentUser) {
                setShowAuthPromptModal(true);
              } else {
                navigate(`/profile/${currentCard.username || currentCard.id}`);
              }
            }}
          />
          
          {/* Thanh tương tác */}
          <div className="discover-actions d-flex align-items-center justify-content-center gap-3 mt-4 w-100">
            <button 
              className="btn btn-light shadow-sm rounded-circle p-3 text-secondary border hover-shadow"
              title={t('discover.rewind')}
              onClick={() => {
                if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
              }}
              disabled={currentIndex === 0}
            >
              <i className="bi bi-arrow-counterclockwise fs-4"></i>
            </button>

            <button 
              className="btn btn-light text-danger shadow-sm rounded-circle p-3 border hover-shadow"
              title={t('common.pass')}
              onClick={handleDislike}
            >
              <i className="bi bi-x-lg fs-4"></i>
            </button>

            <Button 
              className="btn-info rounded-circle shadow p-3 text-white" 
              title="Super Like"
              onClick={handleSuperLike}
            >
              <i className="bi bi-star-fill fs-4 text-white"></i>
            </Button>

            <Button 
              className="btn-danger rounded-circle shadow p-3 text-white" 
              title={t('discover.like_btn')}
              style={{ background: 'linear-gradient(45deg, #ff4b2b, #ff416c)', border: 'none' }}
              onClick={handleLike}
            >
              <i className="bi bi-heart-fill fs-4"></i>
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState 
          icon="bi bi-heartbreak" 
          title={t('discover.no_more_users')} 
          description={t('discover.no_more_users_desc')} 
        />
      )}

      {/* Modal chúc mừng tương hợp */}
      {showMatchModal && newMatch && (
        <MatchModal 
          isOpen={showMatchModal}
          match={newMatch} 
          onClose={closeMatchModal}
          onSendMessage={() => { closeMatchModal(); navigate('/messages'); }}
          onKeepDiscovering={closeMatchModal}
        />
      )}

      {/* Modal yêu cầu Guest Đăng nhập/Đăng ký khi quẹt thẻ hoặc thả tim */}
      <AuthPromptModal 
        isOpen={showAuthPromptModal}
        onClose={() => setShowAuthPromptModal(false)}
        title={t('auth_prompt.title')}
        description={t('auth_prompt.desc')}
      />
    </div>
  );
};

export default DiscoverView;
