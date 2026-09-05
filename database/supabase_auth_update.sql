-- =========================================================================
-- SQL SCRIPT CHO TÍNH NĂNG AUTH & OTP
-- Copy toàn bộ script này và chạy trong SQL Editor của Supabase.
-- =========================================================================

-- 1. Thêm trường password vào bảng users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Cập nhật password mặc định cho các user cũ để họ vẫn có thể đăng nhập được (VD: '123456')
UPDATE public.users SET password = 'password123' WHERE password IS NULL;

-- 3. Bảng password_resets (Lưu trữ mã OTP)
CREATE TABLE IF NOT EXISTS public.password_resets (
    email TEXT PRIMARY KEY,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bật RLS và cấp quyền (Tạm thời cho phép read/write)
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép tất cả thao tác trên password_resets" ON public.password_resets FOR ALL USING (true);
