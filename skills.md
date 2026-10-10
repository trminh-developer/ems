
# TÀI LIỆU HƯỚNG DẪN TỐI ƯU HÓA HỆ THỐNG HEARTCONNECT (BEST PRACTICES)

## 1. Đánh giá tổng quan & Giải pháp tối ưu

Hệ thống HeartConnect hiện tại đang gặp 2 điểm nghẽn (bottleneck) nghiêm trọng có nguy cơ làm sập server khi đưa lên môi trường Production:

1. **Lưu trữ hình ảnh bằng Base64 (LONGTEXT) trong MySQL:**
   - **Rủi ro:** Gây phình to kích thước Database nhanh chóng. Trình duyệt bị treo (lag) khi render số lượng lớn chuỗi Base64 trên trang Feed và Profile. Tải trọng mạng (Payload) quá lớn.
   - **Giải pháp:** Chuyển sang lưu trữ vật lý bằng \multer\ trên ổ cứng server (với quy mô nhỏ) hoặc Cloud Storage (AWS S3, Firebase Storage), sau đó chỉ lưu URL (chuỗi ngắn) vào MySQL.

2. **Cơ chế Polling (gọi API liên tục) cho chức năng Nhắn tin:**
   - **Rủi ro:** Gây quá tải (DDoS ngầm) cho Backend. Trải nghiệm người dùng kém (độ trễ cao).
   - **Giải pháp:** Tích hợp \Socket.io\ để tạo luồng kết nối Real-time TCP/IP ổn định, đẩy tin nhắn ngay lập tức (Push) thay vì chờ Client kéo về (Pull).

---

## 2. Chi tiết triển khai / Mã nguồn thực thi (Giải pháp khắc phục)

### 2.1. Giải pháp loại bỏ Base64 - Tích hợp Multer Upload
**Cài đặt:**
\\\ash
cd backend
npm install multer uuid
npm install @types/multer @types/uuid -D
\\\

**Tạo middleware Upload (\ackend/src/middlewares/uploadMiddleware.ts\):**
\\\	ypescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, \\\\);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload hình ảnh!'), false);
  }
};

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter 
});
\\\

**Sửa Controller cập nhật Avatar:**
\\\	ypescript
// Trích xuất tại UserController.ts
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không tìm thấy file' });
    
    // Đường dẫn tĩnh sẽ được lưu vào DB
    const avatarUrl = \/uploads/\\;
    
    const user = await User.findByPk(req.user.id);
    user.avatar = avatarUrl;
    await user.save();
    
    return res.json({ message: 'Cập nhật thành công', avatar: avatarUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
\\\
*(Nhớ thêm \pp.use(express.static('public'))\ vào \server.ts\ để Frontend đọc được ảnh).*

---

### 2.2. Giải pháp tích hợp Realtime Chat (Socket.io)
**Cài đặt:**
\\\ash
cd backend
npm install socket.io
cd ../frontend
npm install socket.io-client
\\\

**Tích hợp Socket.io vào \server.ts\:**
\\\	ypescript
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

// Map lưu trữ UserId -> SocketId để gửi đúng người
const userSockets = new Map<string, string>();

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  if (userId) userSockets.set(userId, socket.id);

  socket.on('sendMessage', async (data) => {
    // data: { receiverId, content, conversationId }
    // 1. Lưu tin nhắn vào DB ở đây
    
    // 2. Gửi tin nhắn cho người nhận ngay lập tức
    const receiverSocket = userSockets.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMessage', data);
    }
  });

  socket.on('disconnect', () => {
    userSockets.delete(userId);
  });
});

// THAY THẾ app.listen BẰNG httpServer.listen
httpServer.listen(PORT, () => {
  console.log(\Backend & WebSocket running on http://localhost:\\);
});
\\\

---

## 3. Lưu ý vận hành & Mở rộng

- **Dọn dẹp rác (Garbage Collection):** Khi xóa tài khoản hoặc Status, ảnh vật lý trong thư mục \public/uploads\ phải được xóa bằng module \s.unlink\ của Node.js để tránh đầy ổ cứng.
- **Tính khả mở (Scalability):** Nếu dự án có lượng truy cập lớn, \Multer\ lưu file cục bộ sẽ gây cản trở khi triển khai nhiều Server (Load Balancing). Lúc này bắt buộc phải cấu hình lại \Multer\ để đẩy thẳng stream file lên AWS S3.
- **TypeScript:** Ngừng sử dụng \ny\. Hãy tạo các interface rõ ràng cho Socket Payload (\IMessagePayload\) để loại trừ mọi lỗi runtime tiềm ẩn.

