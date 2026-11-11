import React, { useState } from 'react';
import { useAdminList } from '../../hooks/useAdminData';
import { AdminPost, adminService } from '../../services/adminService';
import { AdminDialog, AdminEmpty, AdminError, AdminHeader, AdminLoading, AdminPagination, AdminPersona, AdminSearch, AdminSelect, RefreshButton, date, number, useAdminAction } from '../../components/admin/AdminUI';

export default function AdminFeedView() {
  const list = useAdminList<AdminPost>('/admin/feed');
  const [selected, setSelected] = useState<AdminPost | null>(null);
  const action = useAdminAction(() => { list.refresh(); setSelected(null); });
  const changeVisibility = (post: AdminPost) => action.ask({
    title: post.isHidden ? 'Khôi phục bài viết?' : 'Ẩn bài viết khỏi cộng đồng?',
    description: post.isHidden ? 'Bài viết sẽ xuất hiện lại trên bảng tin.' : 'Bài viết sẽ không xuất hiện trên bảng tin. Bạn có thể khôi phục sau khi kiểm tra lại.',
    label: post.isHidden ? 'Khôi phục bài viết' : 'Ẩn bài viết', danger: !post.isHidden,
    action: () => adminService.visibility(post.id, !post.isHidden), success: post.isHidden ? 'Đã khôi phục bài viết.' : 'Đã ẩn bài viết khỏi bảng tin.',
  });
  return <>
    <AdminHeader title="Quản lý bài viết" description="Giữ nội dung cộng đồng tích cực. Kiểm tra, ẩn hoặc khôi phục bài viết."><RefreshButton onClick={list.refresh} busy={list.loading} /></AdminHeader>
    {list.error && <AdminError message={list.error} retry={list.refresh} />}
    <section className="admin-panel">
      <div className="admin-toolbar"><AdminSearch value={list.query} onChange={list.setQuery} placeholder="Tìm nội dung hoặc username tác giả…" />
        <AdminSelect label="Trạng thái hiển thị" value={list.filter('visibility')} onChange={value => list.setFilter('visibility', value)} options={[['ALL', 'Tất cả bài viết'], ['visible', 'Đang hiển thị'], ['hidden', 'Đã ẩn']]} />
        <button className="admin-text-button" onClick={list.clear}>Xóa bộ lọc</button></div>
      <div className="admin-result-count"><span>{number(list.data?.total)} bài viết</span><span>Ẩn bài viết vẫn giữ lại nội dung để xem xét.</span></div>
      {list.loading ? <AdminLoading /> : list.data?.items.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tác giả</th><th>Nội dung</th><th>Trạng thái</th><th>Ngày đăng</th><th>Thao tác</th></tr></thead><tbody>{list.data.items.map(post => <tr key={post.id}>
        <td><AdminPersona user={post.User} /></td><td><div className="admin-post-excerpt">{post.content || 'Bài viết không có nội dung văn bản'}</div>{post.mediaUrls?.length > 0 && <small className="admin-note"><i className="bi bi-images me-1" />{post.mediaUrls.length} tệp đính kèm</small>}</td>
        <td><span className={'admin-badge ' + (post.isHidden ? 'slate' : 'green')}><span />{post.isHidden ? 'Đã ẩn' : 'Đang hiển thị'}</span></td><td className="nowrap">{date(post.createdAt, true)}</td>
        <td><div className="admin-actions"><button className="admin-button secondary small" onClick={() => setSelected(post)}>Xem bài viết</button><button className={'admin-button small ' + (post.isHidden ? 'secondary' : 'danger')} disabled={action.busy} onClick={() => changeVisibility(post)}>{post.isHidden ? 'Khôi phục' : 'Ẩn bài'}</button></div></td>
      </tr>)}</tbody></table></div> : <AdminEmpty title="Không tìm thấy bài viết" description="Thử từ khóa khác hoặc thay đổi trạng thái hiển thị." icon="collection" />}
      <AdminPagination data={list.data} onChange={list.setFilter} busy={list.loading} />
    </section>
    {selected && <AdminDialog title="Chi tiết bài viết" onClose={() => setSelected(null)} wide busy={action.busy} footer={<><button className="admin-button secondary" onClick={() => setSelected(null)} disabled={action.busy}>Đóng</button><button className={'admin-button ' + (selected.isHidden ? 'primary' : 'danger')} disabled={action.busy} onClick={() => changeVisibility(selected)}>{selected.isHidden ? 'Khôi phục bài viết' : 'Ẩn bài viết'}</button></>}>
      <AdminPersona user={selected.User} /><p className="admin-note mt-2">{date(selected.createdAt, true)}</p><p className="admin-post-content">{selected.content}</p>
      {selected.mediaUrls?.length > 0 && <div className="admin-media-grid">{selected.mediaUrls.map((source, index) => <img key={index} src={source} alt={'Ảnh đính kèm ' + (index + 1)} loading="lazy" />)}</div>}
    </AdminDialog>}
    {action.dialog}
  </>;
}
