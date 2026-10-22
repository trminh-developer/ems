import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreateStatus, StatusCard } from '../components/feed';
import { StoryTray } from '../components/story';
import { useFeed } from '../hooks';
import { Loading, EmptyState } from '../components/common';

const FeedView = () => {
  const { t } = useTranslation();
  const { statuses, isLoading, toggleLike } = useFeed();

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <h2 className="mb-4 fw-bold">{t('feed.title')}</h2>
          
          <StoryTray />
          
          <CreateStatus />
          
          {isLoading ? (
            <div className="text-center py-5">
              <Loading />
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
              title={t('feed.empty_title')} 
              description={t('feed.empty_desc')} 
              icon="bi-journal-x"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedView;
