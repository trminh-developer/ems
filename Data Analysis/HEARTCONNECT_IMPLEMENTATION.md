# Triển khai Match và Discover

Áp dụng `THUẬT TOÁN HEARTCONNECT.docx`, phiên bản `heartconnect-v1`.

## Điểm phù hợp

- Mỗi chiều: sở thích Jaccard **0,40**, mục tiêu **0,30**, khoảng cách **0,20**, hoạt động **0,10**.
- Mục tiêu đúng: 1; mục tiêu thay thế được chấp nhận: 0,5; khác: 0. So sánh mong muốn của người xem với mục tiêu thực tế của đối phương.
- Khoảng cách: `2^(-km / h)`, mặc định `h = 10 km`. Hoạt động: `2^(-ngày / 7)`.
- Bỏ thành phần thiếu và chuẩn hóa lại trọng số. Nếu không có sở thích chung để so sánh lẫn mục tiêu có thể so sánh ở một trong hai chiều, trả `cold_start: true`, `score: null`.
- Điểm chung: `100 × 2ab/(a+b)`, bằng 0 nếu hai điểm bằng 0. Backend giữ số thực; giao diện làm tròn hai chữ số và hiển thị **điểm / 100**.
- Ví dụ trong tài liệu: `a = 0,65`, `b = 0,50` → **56,521739... điểm**. Đây là điểm xếp hạng, chưa được hiệu chỉnh thành xác suất match.
- Super Like không thay đổi điểm phù hợp.

## Điều kiện và chính sách

- Tuổi 18–100, tuổi/giới tính hai chiều, tài khoản ACTIVE và được phép xuất hiện. Không suy đoán giới tính muốn tìm từ giới tính hồ sơ.
- Khoảng tuổi mặc định 18–100, mọi giới tính; bán kính mặc định 100 km. Khi có GPS hợp lệ, không vượt bán kính nhỏ hơn của hai người.
- `distanceRequired` bật: cả hai phải có GPS không quá **30 ngày**. Tọa độ cũ không có thời gian cập nhật được coi là chưa rõ độ mới. Chỉnh sửa thông tin khác không làm mới GPS.
- `goalRequired` bật: chỉ chấp nhận mục tiêu chính hoặc các mục tiêu thay thế người dùng đã chọn.
- Pass ẩn **30 ngày**; hồ sơ thực sự được hiển thị không lặp trong **24 giờ**. Like đã gửi, match hiện có, block và unmatch bị loại khỏi Discover.
- Unmatch giữ trạng thái cặp vĩnh viễn trong bản đầu. Lượt thích cũ hoặc request phát lại không thể tự tạo match mới. Các match lịch sử vẫn được giữ và được tính lại điểm khi đọc.
- Giữ nguyên bảng sở thích hiện có; nhóm đồng nghĩa phổ biến dùng khóa ngữ nghĩa như `travel`, `music`, `coffee`, `photography`. Không tin ID từ danh mục UI cũ vì ID đang khác với dữ liệu seed.

## Truy vấn và phiên khám phá

`GET /api/users/discover?limit=20` trả `{ users, session_id, next_cursor, location_required }` cho người đã đăng nhập. Trang tiếp theo truyền `cursor` đã nhận.

1. Lọc SQL theo trạng thái, tuổi, giới tính, quan hệ và vùng tọa độ. Các mệnh đề quan hệ dùng `NOT EXISTS`, ID được escape bởi Sequelize.
2. Hợp nhất ba nguồn có giới hạn: sở thích liên quan, hoạt động gần đây, người mới. Mặc định mỗi lượt khoảng 500 ứng viên; tối đa ba lượt và 1.500 ID. Có thể điều chỉnh hai biến `DISCOVERY_*` trong `.env.example` sau khi đo độ phủ và tốc độ.
3. Tải đặc trưng và quan hệ theo lô; không tải ảnh ở bước lấy ứng viên. Heap giữ Top K, không tính mọi cặp toàn hệ thống.
4. Lưu ID, thứ tự và điểm vào `discovery_sessions` trong **30 phút**. Cursor thuộc đúng người dùng; chữ ký thiết lập bằng SHA-256 phát hiện thay đổi bộ lọc, sở thích hoặc GPS và trả `409 REFRESH_FEED`.
5. Trước khi trả mỗi trang, kiểm tra lại các hồ sơ và quan hệ theo lô, lấy dư để bù hồ sơ vừa bị loại. Giữ thứ tự của phiên. Client tải thêm khi còn bốn thẻ, tránh gộp trùng ID và bỏ phản hồi của phiên cũ.
6. Danh mục sở thích được cache 60 giây; không cache quyền chặn hay trạng thái tài khoản.

Endpoint `/api/users/recommended` tiếp tục trả mảng để tương thích các màn hình cũ. Khách xem trước không nhận điểm cá nhân hóa.

## Giao dịch và retry

- `pair_states` có khóa chính `(user_low_id, user_high_id)`. Like, pass, block, unmatch và gửi tin nhắn dùng chung khóa cặp trong transaction.
- Tạo hàng cặp bằng `findOrCreate` rồi khóa `FOR UPDATE` trên MySQL/InnoDB. SQLite tuần tự hóa các transaction quan hệ trong tiến trình; có retry ngắn cho lỗi deadlock/busy.
- `user_swipes` duy nhất theo chiều; `dating_requests` duy nhất theo `(user_id, request_id)`. Client giữ request ID khi thất bại. Cùng key khác nội dung trả 409; replay cùng nội dung không tạo thêm match, hội thoại hoặc thông báo.
- Match mới có `pair_key` chuẩn hóa và unique index. Match cũ để NULL, tránh thay đổi hay xóa dữ liệu lịch sử khi bổ sung ràng buộc.
- Thông báo hiện được ghi vào cùng transaction; ứng dụng hiện chưa dùng worker gửi ra ngoài. Nếu bổ sung push/email, cần outbox và chỉ phát sau commit.

## Dữ liệu đo lường và giới hạn kiểm chứng

- `discovery_impressions`: chỉ ghi khi thẻ chiếm ít nhất 60% vùng quan sát trong 500 ms; tải API hoặc tải trước không được tính là xem. Mỗi `(session_id, target_id)` chỉ ghi một lần, kèm phiên bản thuật toán và các thành phần điểm tại lúc đề xuất.
- `dating_events`: like, superlike, pass, match, block, unmatch. Có thể nối cặp với impression để tính MatchRate sau đủ bảy ngày quan sát; không dùng các hồ sơ chưa xem làm mẫu từ chối.
- P95, độ phủ ứng viên, MatchRate và ConversationRate cần được đo trên lưu lượng thật trước khi kết luận chất lượng tăng. Với giới hạn ứng viên, người phù hợp ngoài tập truy vấn có thể chưa được lấy vào phiên; nút tải lại lấy phiên mới sau khi đã xem/xử lý tập trước.
- Các index và transaction được kiểm thử tự động trên SQLite. Cần kiểm tra `EXPLAIN` và stress test trên MySQL/InnoDB của môi trường triển khai trước khi xác nhận hiệu năng hay hành vi khóa nhiều tiến trình. Chưa triển khai A/B test hay học máy.

## Chạy và kiểm thử

Khởi động lại backend để chạy migration cộng thêm trước `sync()`. Migration không dùng `force` hoặc `alter` trên database ứng dụng. Các bảng mới được tạo bằng sync; dữ liệu cũ được giữ lại.

Chạy `npm test` trong `backend`, `npm run build` trong `backend` và `frontend`. Test sử dụng SQLite `:memory:`, không sửa database ứng dụng. Các tình huống gồm công thức mẫu, dữ liệu thiếu, biên tuổi, GPS cũ/kinh tuyến 180°, thích đồng thời, retry, block sau cache, unmatch và cursor không lặp.
