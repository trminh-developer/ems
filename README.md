# 💖 Dating App - Ứng Dụng Hẹn Hò

Chào mừng bạn đến với dự án **Dating App**! Đây là một ứng dụng hẹn hò trực tuyến hiện đại, cho phép người dùng tìm kiếm, kết nối, trò chuyện và nâng cấp tài khoản Premium để trải nghiệm những tính năng độc quyền.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

Dự án được xây dựng theo kiến trúc Monorepo, tách biệt rõ ràng giữa Frontend và Backend, đồng thời áp dụng mô hình **Clean Architecture** để tối ưu hóa khả năng bảo trì và mở rộng.

### Frontend
- **Framework:** React 18 + Vite
- **Ngôn ngữ:** TypeScript
- **Styling:** Bootstrap 5, Custom CSS
- **Quản lý State:** React Context API + Custom Hooks
- **Router:** React Router v6

### Backend
- **Framework:** Node.js + Express.js
- **Ngôn ngữ:** TypeScript
- **Cơ sở dữ liệu (BaaS):** Supabase (PostgreSQL)
- **Tích hợp thanh toán:** VNPay Sandbox, MoMo Sandbox

---

## 🏗️ Cấu Trúc Dự Án (Directory Structure)

Dự án được chia thành 3 thư mục chính độc lập:

\`\`\`text
dating_app/
│
├── frontend/               # 🌐 Nơi chứa toàn bộ mã nguồn React
│   ├── src/
│   │   ├── components/     # Các UI Components dùng chung
│   │   ├── features/       # (Mới) Các tính năng được viết theo Clean Architecture (vd: payment)
│   │   ├── hooks/          # Custom hooks xử lý logic
│   │   ├── contexts/       # Global states
│   │   ├── services/       # Giao tiếp với API / Backend
│   │   └── views/          # Các trang (Pages) của ứng dụng
│   └── package.json        
│
├── backend/                # ⚙️ Nơi chứa toàn bộ mã nguồn Node.js (API Server)
│   ├── src/
│   │   ├── features/       # (Mới) Các module viết theo Clean Architecture (vd: payment)
│   │   ├── utils/          # Các hàm hỗ trợ chung (Supabase client, helpers...)
│   │   └── server.ts       # Entry point của server Express
│   ├── .env                # Biến môi trường (Supabase Keys, VNPay/MoMo Keys)
│   └── package.json        
│
└── database/               # 🗄️ Nơi chứa các file cấu hình SQL cho Supabase
    ├── init_database.sql
    ├── supabase_transactions.sql
    └── ...
\`\`\`

---

## ✨ Tính Năng Nổi Bật (Features)

1. **Đăng nhập / Đăng ký:** Hỗ trợ xác thực người dùng an toàn.
2. **Khám phá (Discover):** Quẹt trái/phải để tìm kiếm đối tượng phù hợp.
3. **Danh sách tương hợp (Matches):** Xem danh sách những người đã tương hợp với bạn.
4. **Nhắn tin trực tiếp (Chat):** Giao tiếp realtime an toàn và tiện lợi.
5. **Gói Nâng cấp (Premium):** 
   - Tích hợp cổng thanh toán **VNPay** và **MoMo** chuẩn.
   - Hỗ trợ luồng chạy Môi trường thử nghiệm (Sandbox) và Môi trường thật (Production).
   - Tự động cộng ngày Premium và lưu lịch sử giao dịch vào cơ sở dữ liệu sau khi thanh toán thành công.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu hệ thống:
- [Node.js](https://nodejs.org/) (Khuyến nghị bản v20+)
- Tài khoản [Supabase](https://supabase.com/)

### Bước 1: Khởi tạo Database
1. Truy cập vào Dashboard của **Supabase**.
2. Mở tab **SQL Editor**.
3. Lần lượt copy và chạy (Run) các đoạn mã SQL trong thư mục `database/` để tạo các bảng cần thiết (`users`, `matches`, `messages`, `transactions`...).

### Bước 2: Cấu hình Backend
Mở một cửa sổ Terminal (hoặc Command Prompt) mới:
\`\`\`bash
cd backend
npm install
\`\`\`
- Tạo file `.env` trong thư mục `backend/` và cấu hình các biến môi trường (Ví dụ: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `VNPAY_TMN_CODE`...).
- Chạy server:
\`\`\`bash
npm run dev
\`\`\`
*(Server sẽ khởi chạy tại cổng http://localhost:3000)*

### Bước 3: Cấu hình Frontend
Mở một cửa sổ Terminal thứ hai (giữ Terminal Backend vẫn đang chạy):
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(Giao diện web sẽ khởi chạy tại cổng http://localhost:5173)*

---

## 🌟 Nhóm Phát Triển
- Phát triển bởi: **TrMinh-Developer**
- Kiến trúc áp dụng: **Clean Architecture** & **Monorepo**

Chúc bạn có một trải nghiệm lập trình thú vị với dự án này! 🎉
