import React, { useState, useEffect } from 'react';
import { Button, Loading } from '../../components/common';
import apiClient from '../../services/apiClient';

const AdminFeedView = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get('/admin/feed');
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Xóa bài viết này? Dữ liệu sẽ biến mất vĩnh viễn!')) return;
    try {
      await apiClient.delete(`/admin/feed/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (e) {
      alert('Lỗi xóa bài viết');
    }
  };

  if (isLoading) return <Loading text="Đang tải Feed..." />;

  return (
    <div>
      <h2 className="mb-4">Quản Lý Bài Viết (Feed)</h2>
      <div className="card bg-dark border-secondary">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Tác giả</th>
                  <th>Nội dung</th>
                  <th>Media</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted py-4">Chưa có bài viết nào</td></tr>
                )}
                {posts.map(p => (
                  <tr key={p.id}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <img 
                          src={p.User?.avatar || 'https://via.placeholder.com/40'} 
                          alt="avatar" 
                          className="rounded-circle me-2" 
                          width="30" height="30" 
                          style={{ objectFit: 'cover' }} 
                        />
                        <span>@{p.User?.username}</span>
                      </div>
                    </td>
                    <td className="align-middle" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.content}
                    </td>
                    <td className="align-middle">
                      {p.media_urls && p.media_urls.length > 0 ? (
                        <span className="badge bg-info">{p.media_urls.length} files</span>
                      ) : '-'}
                    </td>
                    <td className="align-middle">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="align-middle">
                      <Button className="btn-sm btn-outline-danger" onClick={() => deletePost(p.id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminFeedView;
