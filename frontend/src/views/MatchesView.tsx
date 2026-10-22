import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MatchCard, MatchModal } from '../components/dating';
import { Loading, EmptyState } from '../components/common';
import { useMatches } from '../hooks/useMatches';

const MatchesView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { matches, isLoading, loadMatches, showMatchModal, newMatch, closeMatchModal } = useMatches();

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  if (isLoading) return <Loading text={t('matches.loading')} />;

  return (
    <div className="matches-view fade-in">
      <h3 className="mb-4">
        {t('matches.title')} <span className="badge bg-hc-primary rounded-pill fs-6">{matches?.length || 0}</span>
      </h3>
      
      {matches && matches.length > 0 ? (
        <div className="row">
          {matches.map(m => (
            <div key={m.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <MatchCard 
                match={m} 
                onMessage={() => navigate(`/messages`)} 
                onClick={() => navigate(`/profile/${m.matchedUser?.username || m.matchedUser?.id || ''}`)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="bi bi-heart" 
          title={t('matches.empty_title')} 
          description={t('matches.empty_desc')} 
        />
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

export default MatchesView;
