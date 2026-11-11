## 💖 HeartConnect

<div align="center">
    ![Node](https://img.shields.io/badge/node-%3E%3D240-brightgreen)
    ![TypeScript](https://img.shields.io/badge/TypeScript-7.x-blue)
    ![Deploy](https://img.shields.io/badge/deploy-Firebase-red)
</div>

# 💖 HeartConnect - Ứng Dụng Hẹn Hò

Chào mừng bạn đến với dự án **HeartConnect**! Đây là một nền tảng kết nối trực tuyến được thiết kế để giúp người dùng gặp gỡ, giao tiếp và xây dựng các mối quan hệ một cách an toàn và thú vị.

---

## ✨ Các Chức Năng Chính

Dự án cung cấp một trải nghiệm liền mạch với các tính năng cơ bản và nâng cao:

1. **Quản lý Tài Khoản:** Đăng nhập và đăng ký bảo mật, cho phép người dùng tùy chỉnh hồ sơ cá nhân.
2. **Khám Phá & Tương Hợp (Match):** Cơ chế quẹt trái/phải thông minh giúp người dùng dễ dàng tìm kiếm những đối tượng phù hợp với sở thích.
3. **Nhắn Tin Trực Tiếp (Chat):** Hệ thống trò chuyện thời gian thực dành cho những người dùng đã tương hợp.
4. **Tài Khoản Premium:** Các gói nâng cấp trả phí mang lại trải nghiệm không giới hạn và các đặc quyền ưu tiên trong ứng dụng.
5. **Cập nhật vị trí:** Khi người dùng cập nhật vị trí thì sẽ định vị trong khoảng cách gần nhất sẽ phát hiện đối tượng đang gần với mình nhất.
6. **Identity verifications:** Khi người dùng xác minh danh tính, sau khi xác minh xong user phải đợi từ 3 - 7 ngày từ hệ thống duyệt hồ sơ duyệt xác minh danh tính để cung cấp tích xanh.

---

## Thanh toán sandbox và quyền Premium

- Cấu hình `backend/.env` theo `backend/.env.example`, đặt `PAYMENT_MODE=sandbox` và `BACKEND_URL` trỏ đến backend công khai khi nhận callback/IPN. VNPay/MoMo dùng thông tin merchant sandbox; Stripe dùng `sk_test_...`; PayPal dùng tài khoản sandbox.
- VNPay: đăng ký IPN `/api/payments/vnpay/ipn`. MoMo: đặt `MOMO_IPN_URL` thành `<BACKEND_URL>/api/payments/momo/ipn`. Stripe: đăng ký webhook `/api/payments/stripe/webhook` và cấu hình `STRIPE_WEBHOOK_SECRET`.
- Backend tự tạo mã đơn, lấy người mua từ phiên đăng nhập và quyết định giá: 1 tháng 99.000đ, 6 tháng 499.000đ, 12 tháng 899.000đ. PayPal dùng mức chuyển đổi cố định 25.000 VND/USD tại checkout.
- Chỉ giao dịch đã được backend xác nhận mới kích hoạt Premium. Mua thêm cộng tiếp thời hạn còn lại; callback gửi lại không cộng thời hạn lần nữa. Thiếu khóa thanh toán sẽ báo lỗi cấu hình.
- Mọi gói có tích xanh Premium và quyền đổi logo ứng dụng riêng tại **Cài đặt**. Hai quyền này hết hiệu lực khi gói hết hạn; xác minh danh tính được quản lý riêng.
- Tên hiển thị (họ/tên) và username có thời gian chờ riêng 7 ngày sau mỗi lần thay đổi thực sự. Lưu giá trị cũ hoặc sửa thông tin khác không đặt lại thời gian chờ.
- Backend bổ sung các cột mới bằng migration cộng thêm khi khởi động; không cần tạo lại database.

Tài liệu cổng thanh toán: [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [MoMo](https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/), [Stripe](https://docs.stripe.com/checkout/fulfillment), [PayPal](https://developer.paypal.com/api/rest/integration/orders-api).

## Thuật toán Match và Discover

Triển khai theo `Data Analysis/THUẬT TOÁN HEARTCONNECT.docx`: Jaccard, điểm hai chiều với trọng số 40/30/20/10 và trung bình điều hòa; match chỉ tạo khi hai người cùng thích. Discover có bộ lọc hai chiều, phiên phân trang ổn định và ghi nhận hồ sơ thực sự được hiển thị.

Xem [chi tiết triển khai và cách kiểm thử](Data%20Analysis/HEARTCONNECT_IMPLEMENTATION.md). Khởi động lại backend để bổ sung schema; chạy `npm test` trong `backend` để kiểm tra trên database trong bộ nhớ.

## 🌟 Tác Giả

- Phát triển bởi: **MQV**
- Người sáng lập: **Trần Đức Minh**
- Đồng sáng lập: **Trần Quốc Việt - Đỗ Trúc Quỳnh**

Cảm ơn bạn đã quan tâm đến dự án này! 🎉
