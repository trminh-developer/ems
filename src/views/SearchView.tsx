import React, { useState } from 'react';
import { UserCard } from '../components/user';
import { Input, Button, EmptyState, Loading } from '../components/common';
import { userService } from '../services';
import { User } from '../models';
import { calculateAge } from '../utils/helpers';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('all');
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(60);
  const [onlineStatus, setOnlineStatus] = useState('all');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Real-time automatic search effect
  React.useEffect(() => {
    const performSearch = async () => {
      setIsSearching(true);
      try {
        let allUsers = await userService.getUsers();
        
        const q = query.toLowerCase().trim();
        const filtered = allUsers.filter(u => {
          const matchName = u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q);
          const matchBio = u.bio?.toLowerCase().includes(q);
          const matchQuery = q ? (matchName || matchBio) : true;
          const matchGender = gender === 'all' || u.gender === gender;
          const age = calculateAge(u.dateOfBirth);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect already handles the search automatically
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
            <h5 className="mb-3">Bộ lọc tìm kiếm</h5>
            <form onSubmit={handleSearch}>
              <Input 
                label="Từ khóa" 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Tên, sở thích..." 
              />
              
              <div className="mb-3">
                <label className="form-label">Giới tính</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Trạng thái (AI Lọc)</label>
                <select className="form-select" value={onlineStatus} onChange={e => setOnlineStatus(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="online">🟢 Đang Online</option>
                  <option value="offline">⚪ Đang Offline</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Độ tuổi</label>
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
                <Button type="submit" className="btn-hc-primary flex-grow-1">Tìm kiếm</Button>
                <Button type="button" className="btn-outline-secondary" onClick={handleClear}>Xóa bộ lọc</Button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="hc-card p-3 h-100">
            <h5 className="mb-3">Kết quả tìm kiếm</h5>
            {isSearching ? (
              <Loading text="Đang tìm kiếm..." />
            ) : hasSearched ? (
              <>
                <p className="text-muted">Tìm thấy {results.length} người</p>
                {results.length > 0 ? (
                  <div className="row">
                    {results.map(u => (
                      <div key={u.id} className="col-md-4 col-6 mb-3">
                        <UserCard user={u} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="bi bi-search" title="Không tìm thấy kết quả nào phù hợp" description="" />
                )}
              </>
            ) : (
              <EmptyState icon="bi bi-funnel" title="Sử dụng bộ lọc để tìm kiếm người dùng" description="" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
