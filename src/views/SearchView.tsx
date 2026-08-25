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
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    try {
      // Get all users and filter locally for robust searching
      let allUsers = await userService.getUsers();
      
      const q = query.toLowerCase().trim();
      const filtered = allUsers.filter(u => {
        // Query match
        const matchName = u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q);
        const matchBio = u.bio?.toLowerCase().includes(q);
        const matchQuery = q ? (matchName || matchBio) : true;
        
        // Gender match
        const matchGender = gender === 'all' || u.gender === gender;
        
        // Age match
        const age = calculateAge(u.dateOfBirth);
        const matchAge = age >= ageMin && age <= ageMax;
        
        return matchQuery && matchGender && matchAge;
      });
      
      setResults(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setGender('all');
    setAgeMin(18);
    setAgeMax(60);
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
                <label className="form-label">Độ tuổi</label>
                <div className="d-flex align-items-center gap-2">
                  <Input type="number" value={ageMin.toString()} onChange={e => setAgeMin(Number(e.target.value))} min="18" />
                  <span>-</span>
                  <Input type="number" value={ageMax.toString()} onChange={e => setAgeMax(Number(e.target.value))} max="100" />
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
