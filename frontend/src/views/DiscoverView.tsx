import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoverCard, MatchModal } from '../components/dating';
import { UserMap } from '../components/map/UserMap';
import { Button, Loading, EmptyState, SEO } from '../components/common';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { User } from '../models';

const DiscoverView = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { likeUser, dislikeUser, superLikeUser, showMatchModal, newMatch, closeMatchModal } = useMatches();

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchUsers = async () => {
      try {
        const recommended = await userService.getRecommendedUsers(currentUser.id);
        setUsers(recommended || []);
      } catch (error) {
        console.error(error);
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
    const user = users[currentIndex];
    if (!user) return;
    await likeUser(user.id);
    handleNext();
  };

  const handleDislike = async () => {
    const user = users[currentIndex];
    if (!user) return;
    await dislikeUser(user.id);
    handleNext();
  };

  const handleSuperLike = async () => {
    const user = users[currentIndex];
    if (!user) return;
    await superLikeUser(user.id);
    handleNext();
  };

  const [viewMode, setViewMode] = useState<'swipe' | 'map'>('swipe');

  if (isLoading) return <Loading text="Đang tìm người phù hợp..." />;

  const currentCard = currentIndex < users.length ? users[currentIndex] : null;

  return (
    <div className="discover-view fade-in d-flex flex-column align-items-center h-100 py-4">
      <SEO title="Khám phá" description="Quẹt để tìm kiếm bạn đời hoàn hảo của bạn ngay hôm nay." />
      
      {/* Toggle View Mode */}
      <div className="btn-group mb-4 shadow-sm" role="group">
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={viewMode === 'swipe'} onChange={() => setViewMode('swipe')} />
        <label className="btn btn-outline-primary px-4 fw-medium" htmlFor="btnradio1"><i className="bi bi-stack me-2"></i> Quẹt thẻ</label>

        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={viewMode === 'map'} onChange={() => setViewMode('map')} />
        <label className="btn btn-outline-primary px-4 fw-medium" htmlFor="btnradio2"><i className="bi bi-map-fill me-2"></i> Bản đồ</label>
      </div>

      {viewMode === 'map' ? (
        <div className="w-100" style={{ maxWidth: '800px' }}>
          <UserMap users={users} />
        </div>
      ) : currentCard ? (
        <div className="discover-container" style={{ maxWidth: '400px', width: '100%' }}>
          <DiscoverCard 
            user={currentCard} 
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperLike={handleSuperLike}
            onViewProfile={() => navigate(`/profile/${currentCard.username || currentCard.id}`)}
          />
          
          <div className="discover-actions d-flex justify-content-center gap-4 mt-4">
            <Button className="btn-danger rounded-circle p-3" onClick={handleDislike}>
              <i className="bi bi-x-lg fs-4"></i>
            </Button>
            <Button className="btn-info rounded-circle p-3" onClick={handleSuperLike}>
              <i className="bi bi-star-fill fs-4 text-white"></i>
            </Button>
            <Button className="btn-success rounded-circle p-3" onClick={handleLike}>
              <i className="bi bi-heart-fill fs-4"></i>
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState icon="bi bi-search" title="Không còn ai để khám phá" description="Bạn đã xem hết những người xung quanh." />
      )}

      {showMatchModal && newMatch && (
        <MatchModal 
          isOpen={showMatchModal}
          match={newMatch} 
          onClose={closeMatchModal}
          onSendMessage={() => { closeMatchModal(); navigate('/messages'); }}
          onKeepDiscovering={closeMatchModal}
        />
      )}
    </div>
  );
};

export default DiscoverView;


