import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import { useChat } from '../hooks/useChat';
import { UserCard } from '../components/user';
import { MatchCard } from '../components/dating';
import { Loading, EmptyState } from '../components/common';

const HomeView = () => {
  const { user } = useAuth();
  const { matches, isLoading: matchesLoading } = useMatches();
  const { conversations, isLoading: chatLoading } = useChat();
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setRecommendedUsers([{ id: '1', name: 'Alice', age: 24 }, { id: '2', name: 'Bob', age: 26 }, { id: '3', name: 'Charlie', age: 23 }, { id: '4', name: 'Diana', age: 25 }]);
      setNearbyUsers([{ id: '5', name: 'Eve', age: 22 }, { id: '6', name: 'Frank', age: 28 }, { id: '7', name: 'Grace', age: 24 }]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading || matchesLoading || chatLoading) {
    return <Loading text="Đang tải..." />;
  }

  return (
    <div className="home-view fade-in">
      <div className="row mb-4 slide-in-up">
        <div className="col-12">
          <h2>Welcome back, {user?.firstName} 👋</h2>
          <p className="text-muted">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="row mb-4 slide-in-up">
        <div className="col-md-3 col-6 mb-3">
          <div className="hc-card stat-card p-3 text-center">
            <h4>120</h4>
            <p className="text-muted mb-0">Profile Views</p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="hc-card stat-card p-3 text-center">
            <h4>{matches?.length || 0}</h4>
            <p className="text-muted mb-0">Matches</p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="hc-card stat-card p-3 text-center">
            <h4>45</h4>
            <p className="text-muted mb-0">Likes</p>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="hc-card stat-card p-3 text-center">
            <h4>{conversations?.length || 0}</h4>
            <p className="text-muted mb-0">Messages</p>
          </div>
        </div>
      </div>

      <div className="row mb-4 slide-in-up">
        <div className="col-12">
          <div className="hc-card">
            <div className="hc-card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recommended For You</h5>
              <Link to="/discover">View All</Link>
            </div>
            <div className="hc-card-body">
              <div className="row">
                {recommendedUsers.length > 0 ? (
                  recommendedUsers.map(u => (
                    <div key={u.id} className="col-md-3 col-6 mb-3">
                      <UserCard user={u} />
                    </div>
                  ))
                ) : (
                  <EmptyState icon="bi bi-people" title="Không có gợi ý nào" description="" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 slide-in-up">
        <div className="col-12">
          <div className="hc-card">
            <div className="hc-card-header">
              <h5 className="mb-0">New Matches</h5>
            </div>
            <div className="hc-card-body">
              <div className="d-flex overflow-auto">
                {matches && matches.length > 0 ? (
                  matches.map(m => (
                    <div key={m.id} className="me-3" style={{ minWidth: '150px' }}>
                      <MatchCard match={m} onMessage={() => {}} onClick={() => {}} />
                    </div>
                  ))
                ) : (
                  <EmptyState icon="bi bi-heartbreak" title="Chưa có tương hợp nào" description="" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row slide-in-up">
        <div className="col-md-6 mb-4">
          <div className="hc-card h-100">
            <div className="hc-card-header">
              <h5 className="mb-0">Recent Conversations</h5>
            </div>
            <div className="hc-card-body">
              {conversations && conversations.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {conversations.slice(0, 3).map(c => (
                    <li key={c.id} className="list-group-item d-flex align-items-center border-0 px-0">
                      <div className="me-3">
                        <img src="https://via.placeholder.com/50" className="rounded-circle" alt="avatar" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{c.participants?.find((p: any) => p.id !== user?.id)?.firstName || 'User'}</h6>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {c.lastMessage?.content || 'No messages yet'}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon="bi bi-chat-dots" title="Chưa có tin nhắn nào" description="" />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="hc-card h-100">
            <div className="hc-card-header">
              <h5 className="mb-0">People Nearby</h5>
            </div>
            <div className="hc-card-body">
              <div className="row">
                {nearbyUsers.length > 0 ? (
                  nearbyUsers.map(u => (
                    <div key={u.id} className="col-4 text-center">
                      <img src="https://via.placeholder.com/60" className="rounded-circle mb-2" alt="avatar" />
                      <h6 className="mb-0 text-truncate">{u.name}</h6>
                      <small className="text-muted">{u.distance || '2 km'}</small>
                    </div>
                  ))
                ) : (
                  <EmptyState icon="bi bi-geo-alt" title="Không có ai ở gần" description="" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
