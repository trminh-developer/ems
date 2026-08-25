import React, { useState, useEffect } from 'react';
import { DiscoverCard, MatchModal } from '../components/dating';
import { Button, Loading, EmptyState } from '../components/common';
import { useMatches } from '../hooks/useMatches';

const DiscoverView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { likeUser, dislikeUser, superLikeUser, showMatchModal, newMatch, closeMatchModal } = useMatches();

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: '1', name: 'Alice', age: 24, bio: 'Love hiking and reading.', photos: ['https://via.placeholder.com/300x400'] },
        { id: '2', name: 'Bob', age: 26, bio: 'Tech enthusiast.', photos: ['https://via.placeholder.com/300x400'] },
        { id: '3', name: 'Charlie', age: 23, bio: 'Coffee lover.', photos: ['https://via.placeholder.com/300x400'] }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleLike = async () => {
    if (currentIndex >= users.length) return;
    await likeUser(users[currentIndex].id);
    handleNext();
  };

  const handleDislike = async () => {
    if (currentIndex >= users.length) return;
    await dislikeUser(users[currentIndex].id);
    handleNext();
  };

  const handleSuperLike = async () => {
    if (currentIndex >= users.length) return;
    await superLikeUser(users[currentIndex].id);
    handleNext();
  };

  if (isLoading) return <Loading text="Đang tìm người phù hợp..." />;

  const currentUser = currentIndex < users.length ? users[currentIndex] : null;

  return (
    <div className="discover-view fade-in d-flex flex-column align-items-center justify-content-center h-100 py-4">
      {currentUser ? (
        <div className="discover-container" style={{ maxWidth: '400px', width: '100%' }}>
          <DiscoverCard 
            user={currentUser} 
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperLike={handleSuperLike}
            onViewProfile={() => {}}
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
        <EmptyState icon="bi bi-search" title="Không còn ai để khám phá" description="" />
      )}

      {showMatchModal && newMatch && (
        <MatchModal 
          isOpen={showMatchModal}
          match={newMatch} 
          onClose={closeMatchModal}
          onSendMessage={() => {}}
          onKeepDiscovering={closeMatchModal}
        />
      )}
    </div>
  );
};

export default DiscoverView;
