import React from 'react';
import { useTranslation } from 'react-i18next';
import { Match } from '../../models';
import Avatar from '../common/Avatar';
import { calculateAge, formatTime } from '../../utils/helpers';
import Button from '../common/Button';

interface MatchCardProps {
  match: Match;
  onMessage: () => void;
  onClick: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = React.memo(({ match, onMessage, onClick }) => {
  const { t } = useTranslation();
  const partner = match?.matchedUser || (match as any)?.matched_user || {};
  const age = calculateAge(partner.dateOfBirth || partner.date_of_birth);
  const partnerName = partner.firstName || partner.first_name || partner.username || 'Người dùng';
  const partnerAvatar = partner.avatar || partner.photos?.[0] || '';
  const city = partner.location?.city || partner.city || 'Việt Nam';

  return (
    <div className="match-card card border-0 shadow-sm rounded-4 overflow-hidden h-100 cursor-pointer" onClick={onClick}>
      <div className="position-relative">
        <img src={partnerAvatar} alt={partnerName} className="w-100 object-fit-cover" style={{ height: '200px' }} />
        {match?.matchPercentage && (
          <div className="position-absolute top-0 end-0 m-2 badge bg-danger rounded-pill px-2 py-1">
            {match.matchPercentage}% Match
          </div>
        )}
      </div>
      <div className="card-body p-3 d-flex flex-column text-center">
        <h6 className="card-title fw-bold mb-1">
          {partnerName}, {age}
        </h6>
        <p className="card-text text-muted small mb-3">
          <i className="bi bi-geo-alt me-1"></i> {city}
        </p>
        <Button variant="primary" className="mt-auto w-100 rounded-pill" onClick={(e) => { e.stopPropagation(); onMessage(); }}>
          {t('common.message')}
        </Button>
      </div>
    </div>
  );
});

export default MatchCard;
