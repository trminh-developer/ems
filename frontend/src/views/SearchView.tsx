import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserCard } from '../components/user';
import { Input, Button, EmptyState, Loading, AuthPromptModal } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services';
import { User } from '../models';
import { calculateAge } from '../utils/helpers';

const SearchView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  const [gender, setGender] = useState('all');
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(60);
  const [onlineStatus, setOnlineStatus] = useState('all');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Real-time automatic search effect
  useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      try {
        const allUsers = await userService.searchUsers(query);
        
        const q = query.toLowerCase().trim();
        const filtered = allUsers.filter(u => {
          const matchUsername = (u.username || '').toLowerCase().includes(q);
          const matchName = (u.firstName || '').toLowerCase().includes(q) || (u.lastName || '').toLowerCase().includes(q);
          const matchBio = (u.bio || '').toLowerCase().includes(q);
          const matchQuery = q ? (matchName || matchBio || matchUsername) : true;
          const matchGender = gender === 'all' || u.gender?.toLowerCase() === gender;
          const age = Number(calculateAge(u.dateOfBirth));
          const matchAge = age >= ageMin && age <= ageMax;
          const matchOnline = onlineStatus === 'all' ? true : onlineStatus === 'online' ? u.isOnline : !u.isOnline;
          
          return matchQuery && matchGender && matchAge && matchOnline;
        });
        
        setResults(filtered);
        if (q || gender !== 'all' || ageMin !== 18 || ageMax !== 60 || onlineStatus !== 'all') {
          setHasSearched(true);
        } else {
          setHasSearched(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    // Add a tiny debounce for typing
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, gender, ageMin, ageMax, onlineStatus]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setQuery('');
    setGender('all');
    setAgeMin(18);
    setAgeMax(60);
    setOnlineStatus('all');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="search-view fade-in">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="search-filters hc-card p-3">
            <h5 className="mb-3">{t('search.filters_title')}</h5>
            <form onSubmit={handleSearch}>
              <Input 
                label={t('search.keyword')} 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder={t('search.keyword_placeholder')} 
              />
              
              <div className="mb-3">
                <label className="form-label">{t('search.gender')}</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="all">{t('common.all')}</option>
                  <option value="male">{t('common.male')}</option>
                  <option value="female">{t('common.female')}</option>
                  <option value="other">{t('common.other')}</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">{t('search.status')}</label>
                <select className="form-select" value={onlineStatus} onChange={e => setOnlineStatus(e.target.value)}>
                  <option value="all">{t('common.all')}</option>
                  <option value="online">🟢 {t('search.online_only')}</option>
                  <option value="offline">⚪ {t('search.offline_only')}</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">{t('search.age_range')}</label>
                <div className="d-flex align-items-center gap-2">
                  <Input 
                    type="text" 
                    value={ageMin.toString()} 
                    onChange={e => {
                      const val = parseInt(e.target.value.replace(/\D/g, ''));
                      setAgeMin(isNaN(val) ? 0 : val);
                    }} 
                    placeholder="Min" 
                  />
                  <span>-</span>
                  <Input 
                    type="text" 
                    value={ageMax.toString()} 
                    onChange={e => {
                      const val = parseInt(e.target.value.replace(/\D/g, ''));
                      setAgeMax(isNaN(val) ? 0 : val);
                    }} 
                    placeholder="Max" 
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <Button type="submit" className="btn-hc-primary flex-grow-1">{t('common.search')}</Button>
                <Button type="button" className="btn-outline-secondary" onClick={handleClear}>{t('search.clear_filters')}</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="hc-card p-3 h-100">
            <h5 className="mb-3">{t('search.results_title')}</h5>
            {isSearching ? (
              <Loading text={t('search.searching')} />
            ) : hasSearched ? (
              <>
                <p className="text-muted">{results.length} profiles</p>
                {results.length > 0 ? (
                  <div className="row">
                    {results.map(u => (
                      <div key={u.id} className="col-md-4 col-6 mb-3">
                        <UserCard 
                          user={u} 
                          onClick={() => {
                            if (!user) {
                              setShowAuthModal(true);
                            } else {
                              navigate(`/profile/${u.username || u.id}`);
                            }
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="bi bi-search" title={t('search.no_results')} description={t('search.no_results_desc')} />
                )}
              </>
            ) : (
              <EmptyState icon="bi bi-funnel" title={t('search.filters_title')} description={t('search.no_results_desc')} />
            )}
          </div>
        </div>
      </div>

      <AuthPromptModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={t('auth_prompt.title')}
        description={t('auth_prompt.desc')}
      />
    </div>
  );
};

export default SearchView;
