import React from 'react';
import { CreateStatus, StatusCard } from '../components/feed';
import { useFeed } from '../hooks';
import { Loading, EmptyState } from '../components/common';

const FeedView = () => {
  const { statuses, isLoading, toggleLike } = useFeed();

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <h2 className="mb-4 fw-bold">Bảng tin</h2>
          
          <CreateStatus />
          
          {isLoading ? (
            <div className="text-center py-5">
              <Loading size="lg" />
            </div>
          ) : statuses.length > 0 ? (
            <div className="feed-list">
              {statuses.map(status => (
                <StatusCard 
                  key={status.id} 
                  status={status} 
                  onLike={toggleLike}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Chưa có bài viết nào" 
              description="Hãy là người đầu tiên chia sẻ khoảnh khắc của bạn!" 
              icon="bi-journal-x"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedView;
