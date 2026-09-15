import React, { useState, useEffect } from 'react';
import { Story } from '../../models';
import { storyService } from '../../services';
import { useAuth } from '../../hooks/useAuth';
import { StoryViewer } from './StoryViewer';
import { CreateStoryModal } from './CreateStoryModal';
import Avatar from '../common/Avatar';

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
    user: groupedStories[userId]?.[0]?.user,
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
      const nextUserId = usersWithStories[currentIndex + 1]?.userId;
      if (nextUserId) setViewingUserId(nextUserId);
      else setViewingUserId(null);
    } else {
      setViewingUserId(null);
    }
  };

  return (
    <>
      <div className="d-flex overflow-auto py-3 gap-3 story-tray no-scrollbar">
        {/* Create Story Button */}
        <div className="d-flex flex-column align-items-center cursor-pointer" onClick={() => setIsCreateOpen(true)}>
          <div className="position-relative mb-1">
            <Avatar src={user?.avatar || ''} alt={user?.firstName || 'Me'} size="lg" />
            <div className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border border-2 border-white" style={{ width: '20px', height: '20px' }}>
              <i className="bi bi-plus" style={{ fontSize: '1rem', marginTop: '-2px' }}></i>
            </div>
          </div>
          <span className="small">Tin của bạn</span>
        </div>

        {/* Other Users' Stories */}
        {usersWithStories.map(item => (
          <div key={item.userId} className="d-flex flex-column align-items-center cursor-pointer" onClick={() => handleUserClick(item.userId)} style={{ width: '70px' }}>
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
          stories={groupedStories[viewingUserId] || []} 
          onClose={handleViewerClose} 
          onComplete={handleViewerComplete} 
        />
      )}
    </>
  );
};
