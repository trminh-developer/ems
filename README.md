## 💖 HeartConnect

<div align="center">
    ![Node](https://img.shields.io/badge/node-24.x-brightgreen)
    ![TypeScript](https://img.shields.io/badge/TypeScript-7.x-blue)
    ![Deploy](https://img.shields.io/badge/deploy-Vercel-black)
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

## Thanh toán QR ngân hàng và quyền Premium

- Cấu hình `backend/.env` theo `backend/.env.example`, đặt `PAYMENT_MODE=sandbox` và `BACKEND_URL` trỏ đến backend công khai khi nhận callback/IPN. VNPay/MoMo dùng thông tin merchant sandbox; Stripe dùng `sk_test_...`; PayPal dùng tài khoản sandbox.
- VNPay: đăng ký IPN `/api/payments/vnpay/ipn`. MoMo: đặt `MOMO_IPN_URL` thành `<BACKEND_URL>/api/payments/momo/ipn`. Stripe: đăng ký webhook `/api/payments/stripe/webhook` và cấu hình `STRIPE_WEBHOOK_SECRET`.
- Backend tự tạo mã đơn, lấy người mua từ phiên đăng nhập và quyết định giá test: 1 tháng **3.000đ**, 6 tháng **6.000đ**, 12 tháng **9.000đ**. Giao diện checkout luôn tải giá từ backend; không dùng giá cũ trong localStorage. PayPal dùng mức chuyển đổi cố định 25.000 VND/USD tại checkout.
- Phương thức **Chuyển qua ngân hàng (QR code)** thay VNPay trên giao diện. Mặc định `BANK_PAYMENT_MODE=direct`: mỗi gói dùng đúng ảnh từ link VietQR do chủ tài khoản cung cấp, nhận tại **BIDV · 96247MB07Y · TRAN DUC MINH**. Ba ảnh được lưu ở `frontend/public/payments/bidv-premium-*.png`, có dự phòng về URL gốc khi ảnh cục bộ không tải được. Không cần khóa merchant để hiển thị QR chuyển khoản trực tiếp.
- Với QR trực tiếp, người mua chuyển tiền thật bằng ứng dụng ngân hàng rồi nhập mã giao dịch trên biên lai. Đơn vẫn `PENDING`; nút “Tôi đã chuyển khoản” chỉ gửi thông tin đối soát. Tài khoản **ADMIN** vào **Quản trị → Doanh thu & Premium → Đối soát chuyển khoản QR**, kiểm tra người chuyển và tiền thực nhận trong sao kê BIDV, nhập mã giao dịch/số tiền rồi xác nhận để kích hoạt Premium. CENSOR và người mua không được duyệt. Vì nội dung QR dùng chung theo gói, không xác nhận chỉ dựa trên nội dung hoặc số tiền. Một mã giao dịch ngân hàng chỉ dùng cho một đơn; lưu người duyệt và thời điểm xác nhận.
- Có thể chuyển sang checkout tự động bằng `BANK_PAYMENT_MODE=sepay` và SDK `sepay-pg-node` ở backend. Cấu hình `SEPAY_ENV`, `SEPAY_MERCHANT_ID`, `SEPAY_SECRET_KEY` trong môi trường backend; local dùng `backend/.env.local` (được Git bỏ qua). Không đưa secret vào biến `VITE_*` hoặc mã React. SePay sandbox không chuyển tiền thật; muốn checkout nhận tiền thật phải dùng `SEPAY_ENV=production` cùng merchant/key production. Backend từ chối dùng bộ khóa test trong production. Đơn lưu chế độ/môi trường riêng, nên IPN sandbox không duyệt đơn QR trực tiếp.
- Với chế độ `sepay`, đăng ký IPN `https://heartconnect-qa29.onrender.com/api/payments/sepay/ipn` ở **SePay → Cổng thanh toán → Cấu hình → IPN**, chọn xác thực `SECRET_KEY`. Đặt cùng giá trị cho `SEPAY_IPN_SECRET` ở backend và mục IPN; nếu không đặt riêng, cần cấu hình IPN dùng merchant secret. Backend kiểm tra đơn, VND, số tiền và giao dịch ngân hàng đã duyệt qua API SePay; callback gửi lại không cộng Premium lần nữa. IPN của Cổng thanh toán này không xác nhận ba QR trực tiếp.
- `FRONTEND_URL` ở backend cần là URL frontend công khai (production hiện tại: `https://heartconnect.vercel.app`) để SePay đưa khách về đúng trang kết quả. Phương thức khác chưa có khóa production sẽ hiển thị chưa khả dụng.
- Logo ngân hàng, MoMo, Visa, Mastercard và PayPal được phục vụ từ `frontend/public/payments`, không phụ thuộc vào CDN khi người dùng mở checkout.
- Chỉ giao dịch đã được backend xác nhận mới kích hoạt Premium. Mua thêm cộng tiếp thời hạn còn lại; đối soát hoặc callback gửi lại không cộng thời hạn lần nữa. Checkout SePay thiếu khóa thanh toán sẽ báo lỗi cấu hình.
- Mọi gói có tích xanh Premium và quyền đổi logo ứng dụng riêng tại **Cài đặt**. Hai quyền này hết hiệu lực khi gói hết hạn; xác minh danh tính được quản lý riêng.
- Tên hiển thị (họ/tên) và username có thời gian chờ riêng 7 ngày sau mỗi lần thay đổi thực sự. Lưu giá trị cũ hoặc sửa thông tin khác không đặt lại thời gian chờ.
- Backend bổ sung các cột mới bằng migration cộng thêm khi khởi động; không cần tạo lại database.

Tài liệu cổng thanh toán: [VNPay](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [MoMo](https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/), [Stripe](https://docs.stripe.com/checkout/fulfillment), [PayPal](https://developer.paypal.com/api/rest/integration/orders-api).

## Thuật toán Match và Discover

Triển khai theo `Data Analysis/THUẬT TOÁN HEARTCONNECT.docx`: Jaccard, điểm hai chiều với trọng số 40/30/20/10 và trung bình điều hòa; match chỉ tạo khi hai người cùng thích. Discover có bộ lọc hai chiều, phiên phân trang ổn định và ghi nhận hồ sơ thực sự được hiển thị.

Xem [chi tiết triển khai và cách kiểm thử](Data%20Analysis/HEARTCONNECT_IMPLEMENTATION.md). Khởi động lại backend để bổ sung schema; chạy `npm test` trong `backend` để kiểm tra trên database trong bộ nhớ.

## CI/CD trên GitLab và Vercel

- Frontend Vercel và backend Render được triển khai riêng. Push thành công hoặc `/api/health` trả 200 chưa chứng minh backend đã cập nhật. Backend mới trả `apiVersion: 2` và `commit` (SHA từ `RENDER_GIT_COMMIT`) trong health; health trả 503 cho tới khi database và migration sẵn sàng.
- Với service Render hiện có `heartconnect-qa29`, kiểm tra repository là `trminh-developer/dating-app`, branch `main`, Node.js 24. Nếu dùng runtime Node với Root Directory ở gốc repo: Build Command là `npm ci --include=dev --prefix backend && node scripts/prepare-ci.cjs && npm run build --prefix backend && npm test --prefix backend`; Start Command là `npm start --prefix backend`; Health Check Path là `/api/health`. Giữ các biến môi trường database, JWT và thanh toán trong Render.
- Sau khi backend và frontend deploy, chạy `npm run smoke:deployment -- https://heartconnect.vercel.app <SHA-commit-backend>`. Lệnh kiểm tra các API công khai, các route có xác thực và phiên bản backend; trả mã lỗi nếu route còn 404 hoặc backend cũ. Các request ghi dùng phiên chưa đăng nhập và phải bị chặn 401, không tạo dữ liệu thật.

- `.gitlab-ci.yml` chạy trên Node.js 24, cài dependency bằng `npm ci` theo lockfile, kiểm tra TypeScript frontend, build backend, chạy toàn bộ test backend bằng SQLite trong bộ nhớ rồi build frontend. Pipeline chạy khi push nhánh hoặc tạo/cập nhật merge request; tránh chạy trùng pipeline push khi đã có merge request.
- `allowScripts` trong mỗi `package.json` cho phép các script cài đặt cần thiết ở đúng phiên bản đã khóa (như SQLite và esbuild) khi dùng npm mới. Khi nâng phiên bản các package này, cập nhật mục tương ứng cùng lockfile.
- `scripts/prepare-ci.cjs` kiểm tra SQLite trước khi chạy test. Nếu binary tải sẵn yêu cầu glibc mới hơn máy CI Linux, script biên dịch lại SQLite bằng `node-gyp` trên chính máy đó; cần Python và bộ biên dịch C++ (có trên máy build Vercel và image GitLab đang dùng).
- Vercel dùng kết nối GitLab của project `heartconnect`: push vào `main` tạo bản production; các nhánh khác tạo bản preview. `vercel.json` ở gốc chạy cùng lệnh `npm run ci` trước mỗi deployment, nên lỗi typecheck, test hoặc build sẽ chặn bản deploy đó. Không cần lưu `VERCEL_TOKEN` trong GitLab.
- Cấu hình project Vercel: **Root Directory** để trống (gốc repository), **Framework Preset** là Vite, **Node.js Version** là 24.x, **Production Branch** là `main`. Install Command và Build Command lấy từ `vercel.json`; Output Directory là `frontend/dist`. Không chuyển Root Directory sang `frontend`, vì bộ kiểm tra cần cả backend.
- Đặt `VITE_API_URL=/api` cho cả Production và Preview trong Vercel. API được proxy sang backend Render qua rewrite hiện có; CI không khởi động server production và không dùng database thật.
- Xem kết quả tại **GitLab → Build → Pipelines** và **Vercel → Deployments → Build Logs**. Backend tiếp tục được triển khai riêng trên Render.

Chạy cùng bộ kiểm tra ở máy local từ gốc repository:

```bash
npm ci --include=dev --prefix frontend
npm ci --include=dev --prefix backend
npm run ci
```

Tham khảo: [Vercel for GitLab](https://vercel.com/docs/git/vercel-for-gitlab), [Vercel Build Configuration](https://vercel.com/docs/builds/configure-a-build), [GitLab workflow rules](https://docs.gitlab.com/ci/yaml/workflow/).

## 🌟 Tác Giả

- Phát triển bởi: **MQV**
- Người sáng lập: **Trần Đức Minh**
- Đồng sáng lập: **Trần Quốc Việt - Đỗ Trúc Quỳnh**

Cảm ơn bạn đã quan tâm đến dự án này! 🎉
