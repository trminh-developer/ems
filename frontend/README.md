# Dating App (Vite + React) 💖

Dating App là một ứng dụng hẹn hò trực tuyến hiện đại, được xây dựng với mục tiêu mang lại trải nghiệm kết nối và tương tác mượt mà cho người dùng. Ứng dụng cung cấp các tính năng từ cơ bản đến nâng cao như vuốt tương hợp, nhắn tin theo thời gian thực và chia sẻ khoảnh khắc qua Bảng tin (Social Feed).

## 🚀 Tính năng nổi bật

- **Khám phá & Tương hợp (Swipe & Match):** Thuật toán hiển thị thẻ hồ sơ trực quan. Quẹt phải để thích, quẹt trái để bỏ qua. Hỗ trợ Super Like.
- **Bảng tin (Social Feed):** Đăng tải trạng thái, chia sẻ hình ảnh/video, tương tác (Thích, Bình luận) với những người dùng khác trong cộng đồng.
- **Nhắn tin (Chat):** Trò chuyện trực tiếp với những người đã tương hợp.
- **Quản lý Hồ sơ:** Tùy chỉnh thông tin cá nhân, cập nhật Avatar, ảnh bìa, thêm thẻ sở thích (Interests).
- **Xác thực an toàn:** Đăng ký, Đăng nhập, và Khôi phục mật khẩu thông qua mã OTP bảo mật.
- **Dark Mode:** Tích hợp chế độ tối ưu hóa cho mắt khi sử dụng vào ban đêm.
- **Đa ngôn ngữ:** Hỗ trợ chuyển đổi ngôn ngữ linh hoạt.

## 🛠 Công nghệ sử dụng

- **Frontend:** React.js, Vite, TypeScript
- **Styling:** Bootstrap 5, CSS thuần, Bootstrap Icons
- **Quản lý trạng thái:** React Context API + Custom Hooks
- **Routing:** React Router DOM (Lazy Loading)
- **Backend/Database:** Supabase (PostgreSQL, Storage, RLS)
- **Email Service:** EmailJS

## 📦 Hướng dẫn cài đặt & Chạy dự án

1. **Clone repository:**
   ```bash
   git clone https://github.com/trminh-developer/ems.git
   cd ems
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   - Tạo file `.env` ở thư mục gốc của dự án.
   - Tham khảo cấu hình cần thiết từ đội ngũ phát triển.

4. **Chạy server phát triển:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại: `http://localhost:5173`

5. **Build cho môi trường Production:**
   ```bash
   npm run build
   ```

## Kết nối API khi đăng nhập

- Chạy backend bằng `npm run dev --prefix backend` và frontend bằng `npm run dev --prefix frontend` từ thư mục gốc repository.
- Localhost, LAN, Dev Tunnel và Vercel dùng `/api` trên cùng địa chỉ frontend. Vite proxy mặc định tới `http://127.0.0.1:3000`; thay backend/port bằng `API_PROXY_TARGET` trong `frontend/.env.local` rồi khởi động lại Vite. Xem `frontend/.env.example`.
- Vercel đã có rewrite `/api/:path*` tới Render trong cả hai file `vercel.json`. Với custom domain trên Vercel, đặt `VITE_API_URL=/api` trước khi build. Firebase/static hosting chưa có API rewrite thì dùng URL HTTPS của backend cho `VITE_API_URL`.
- Khi gọi backend trực tiếp từ domain khác, cấu hình `FRONTEND_URL` hoặc `CORS_ORIGINS` (danh sách origin phân cách bằng dấu phẩy) ở backend. Origin cần đầy đủ giao thức và port. Khởi động/deploy lại backend sau khi đổi cấu hình.
- Chẩn đoán: `/api/health` phải trả JSON `status: OK`; POST `/api/auth/login` bằng thông tin không hợp lệ phải trả HTTP 401, không phải lỗi kết nối hoặc HTML. Kiểm tra cả OPTIONS và POST vì CORS phải áp dụng trên cả hai phản hồi.

Tham khảo: [Vite proxy](https://vite.dev/config/server-options#server-proxy), [Vercel rewrites](https://vercel.com/docs/rewrites).

## 🔒 Bản quyền & Bảo mật
Toàn bộ mã nguồn cốt lõi, thiết kế cơ sở dữ liệu và thuật toán ghép đôi của dự án đều là tài sản nội bộ và được bảo mật tuyệt đối. Vui lòng không sao chép hoặc phân phối với mục đích thương mại mà không có sự cho phép.
