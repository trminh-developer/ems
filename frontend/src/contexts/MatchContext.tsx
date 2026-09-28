import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Match } from '../models';
import { matchService } from '../services';

interface MatchState {
  matches: Match[];
  isLoading: boolean;
  showMatchModal: boolean;
  newMatch?: Match;
}

type MatchAction =
  | { type: 'LOAD_MATCHES_START' }
  | { type: 'LOAD_MATCHES_SUCCESS'; payload: Match[] }
  | { type: 'NEW_MATCH'; payload: Match }
  | { type: 'CLOSE_MODAL' };

const initialState: MatchState = {
  matches: [],
  isLoading: false,
  showMatchModal: false,
};

const matchReducer = (state: MatchState, action: MatchAction): MatchState => {
  switch (action.type) {
    case 'LOAD_MATCHES_START':
      return { ...state, isLoading: true };
    case 'LOAD_MATCHES_SUCCESS':
      return { ...state, matches: action.payload, isLoading: false };
    case 'NEW_MATCH':
      return { ...state, matches: [action.payload, ...state.matches], showMatchModal: true, newMatch: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, showMatchModal: false, newMatch: undefined };
    default:
      return state;
  }
};

export interface MatchContextType extends MatchState {
  loadMatches: () => Promise<void>;
  likeUser: (userId: string) => Promise<void>;
  dislikeUser: (userId: string) => Promise<void>;
  superLikeUser: (userId: string) => Promise<void>;
  closeMatchModal: () => void;
}

export const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) return JSON.parse(userStr).id;
    } catch (e) {}
    return '';
  };

  const loadMatches = useCallback(async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    dispatch({ type: 'LOAD_MATCHES_START' });
    try {
      const matches = await matchService.getMatches(currentUserId);
      dispatch({ type: 'LOAD_MATCHES_SUCCESS', payload: matches });
    } catch (error) {
      console.error('Error loading matches:', error);
      dispatch({ type: 'LOAD_MATCHES_SUCCESS', payload: [] });
    }
  }, []);

  const likeUser = async (targetId: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    const result = await matchService.likeUser(currentUserId, targetId);
    if (result.matched && result.match) {
      dispatch({ type: 'NEW_MATCH', payload: result.match });
    }
  };

  const dislikeUser = async (targetId: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    await matchService.dislikeUser(currentUserId, targetId);
  };

  const superLikeUser = async (targetId: string) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    const result = await matchService.superLikeUser(currentUserId, targetId);
    if (result.matched && result.match) {
      dispatch({ type: 'NEW_MATCH', payload: result.match });
    }
  };

  const closeMatchModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <MatchContext.Provider value={{ ...state, loadMatches, likeUser, dislikeUser, superLikeUser, closeMatchModal }}>
      {children}
    </MatchContext.Provider>
  );
};

