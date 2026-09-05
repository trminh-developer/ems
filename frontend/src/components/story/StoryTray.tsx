import React, { useState, useEffect } from 'react';
import { Story } from '../../models';
import { storyService } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import { StoryViewer } from './StoryViewer';
import { CreateStoryModal } from './CreateStoryModal';

export const StoryTray: React.FC = () => {
  const { user } = useAuth();
  const [groupedStories, setGroupedStories] = useState<{ [userId: string]: Story[] }>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      const data = await storyService.getFeedStories();
      setGroupedStories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryCreated = () => {
    fetchStories();
  };

  const usersWithStories = Object.keys(groupedStories).map(userId => ({
    userId,
    user: groupedStories[userId][0].user,
    hasUnread: true // Thường sẽ check story_views ở đây
  }));

  const handleUserClick = (userId: string) => {
    setViewingUserId(userId);
  };

  const handleViewerClose = () => {
    setViewingUserId(null);
  };

  const handleViewerComplete = () => {
    // Tự chuyển qua user tiếp theo nếu có
    const currentIndex = usersWithStories.findIndex(u => u.userId === viewingUserId);
    if (currentIndex >= 0 && currentIndex < usersWithStories.length - 1) {
      setViewingUserId(usersWithStories[currentIndex + 1].userId);
    } else {
      setViewingUserId(null);
    }
  };

  return (
    <>
      <div className="story-tray hc-card p-3 mb-4 d-flex gap-3 overflow-auto" style={{ whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
        {/* Create Story Button */}
        <div className="story-item d-flex flex-column align-items-center" style={{ width: '80px', cursor: 'pointer' }} onClick={() => setIsCreateOpen(true)}>
          <div className="position-relative rounded-circle mb-1 bg-light d-flex justify-content-center align-items-center border border-2 border-secondary border-dashed" style={{ width: '64px', height: '64px' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="You" className="w-100 h-100 rounded-circle object-fit-cover" style={{ opacity: 0.7 }} />
            ) : (
              <i className="bi bi-person text-secondary fs-3"></i>
            )}
            <div className="position-absolute bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow" style={{ width: '24px', height: '24px', bottom: '-4px', right: '-4px' }}>
              <i className="bi bi-plus" style={{ fontSize: '1.2rem' }}></i>
            </div>
          </div>
          <span className="small text-truncate w-100 text-center fw-bold text-muted">Tạo tin</span>
        </div>

        {/* User Stories */}
        {usersWithStories.map((item) => (
          <div key={item.userId} className="story-item d-flex flex-column align-items-center" style={{ width: '80px', cursor: 'pointer' }} onClick={() => handleUserClick(item.userId)}>
            <div className={`rounded-circle p-1 mb-1 ${item.hasUnread ? 'bg-hc-gradient' : 'bg-secondary'}`} style={{ width: '70px', height: '70px' }}>
              <img src={item.user?.avatar || '/default-avatar.png'} alt="Story" className="w-100 h-100 rounded-circle object-fit-cover border border-2 border-white" />
            </div>
            <span className="small text-truncate w-100 text-center">{item.user?.firstName}</span>
          </div>
        ))}
      </div>

      <CreateStoryModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onStoryCreated={handleStoryCreated} />
      
      {viewingUserId && (
        <StoryViewer 
          stories={groupedStories[viewingUserId]} 
          onClose={handleViewerClose} 
          onComplete={handleViewerComplete} 
        />
      )}
    </>
  );
};
