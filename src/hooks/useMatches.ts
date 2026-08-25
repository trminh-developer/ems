import { useContext } from 'react';
import { MatchContext, MatchContextType } from '../contexts/MatchContext';

export const useMatches = (): MatchContextType => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
