import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
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

  const loadMatches = async () => {
    dispatch({ type: 'LOAD_MATCHES_START' });
    const matches = await matchService.getMatches();
    dispatch({ type: 'LOAD_MATCHES_SUCCESS', payload: matches });
  };

  const likeUser = async (userId: string) => {
    const result = await matchService.likeUser(userId);
    if (result.matched && result.match) {
      dispatch({ type: 'NEW_MATCH', payload: result.match });
    }
  };

  const dislikeUser = async (userId: string) => {
    await matchService.dislikeUser(userId);
  };

  const superLikeUser = async (userId: string) => {
    const result = await matchService.superLikeUser(userId);
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
