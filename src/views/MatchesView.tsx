import React from 'react';
import { MatchCard, MatchModal } from '../components/dating';
import { Loading, EmptyState } from '../components/common';
import { useMatches } from '../hooks/useMatches';

const MatchesView = () => {
  const { matches, isLoading, showMatchModal, newMatch, closeMatchModal } = useMatches();

  if (isLoading) return <Loading text="Đang tải tương hợp..." />;

  return (
    <div className="matches-view fade-in">
      <h3 className="mb-4">Matches <span className="badge bg-hc-primary rounded-pill fs-6">{matches?.length || 0}</span></h3>
      
      {matches && matches.length > 0 ? (
        <div className="row">
          {matches.map(m => (
            <div key={m.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <MatchCard match={m} onMessage={() => {}} onClick={() => {}} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="bi bi-heart" title="No matches yet ❤️" description="Start discovering people to find your match." />
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

export default MatchesView;
