-- Bảng users
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar TEXT,
    cover_photo TEXT,
    gender TEXT,
    date_of_birth DATE,
    city TEXT,
    country TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    bio TEXT,
    profession TEXT,
    education TEXT,
    photos TEXT[],
    relationship_goal TEXT,
    is_online BOOLEAN DEFAULT false,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng user_preferences
CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    preferred_gender TEXT[],
    age_min INTEGER DEFAULT 18,
    age_max INTEGER DEFAULT 99,
    max_distance INTEGER DEFAULT 50
);

-- Bảng interests
CREATE TABLE public.interests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    category TEXT
);

-- Bảng user_interests (Many-to-Many)
CREATE TABLE public.user_interests (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interest_id TEXT REFERENCES public.interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- Bảng matches
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    matched_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_percentage INTEGER,
    matched_at TIMESTAMPTZ DEFAULT NOW(),
    is_new BOOLEAN DEFAULT true,
    last_message TEXT,
    UNIQUE(user_id, matched_user_id)
);

-- Bảng conversations
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    unread_count INTEGER DEFAULT 0
);

-- Bảng conversation_participants
CREATE TABLE public.conversation_participants (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

-- Bảng messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type TEXT DEFAULT 'text',
    status TEXT DEFAULT 'sent',
    is_deleted BOOLEAN DEFAULT false
);

-- Bảng notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT
);

-- Thiết lập Row Level Security (RLS) để bảo mật
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Tạo các Policy tạm thời cho phép đọc/ghi toàn bộ (để phát triển dễ dàng trước)
CREATE POLICY "Cho phép tất cả thao tác trên users" ON public.users FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên user_preferences" ON public.user_preferences FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên interests" ON public.interests FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên user_interests" ON public.user_interests FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên conversations" ON public.conversations FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên conversation_participants" ON public.conversation_participants FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên messages" ON public.messages FOR ALL USING (true);
CREATE POLICY "Cho phép tất cả thao tác trên notifications" ON public.notifications FOR ALL USING (true);
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
-- =========================================================================
-- SQL SCRIPT CHO TÍNH NĂNG SOCIAL FEED (STATUSES)
-- Copy toàn bộ script này và chạy trong SQL Editor của Supabase.
-- =========================================================================

-- 1. Bảng statuses (Bài viết/Trạng thái)
CREATE TABLE public.statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0
);

-- 2. Bảng status_likes (Lượt thích)
CREATE TABLE public.status_likes (
    status_id UUID REFERENCES public.statuses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (status_id, user_id)
);

-- 3. Bảng status_comments (Bình luận)
CREATE TABLE public.status_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_id UUID REFERENCES public.statuses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bật Row Level Security (RLS)
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_comments ENABLE ROW LEVEL SECURITY;

-- 5. Tạo Policies TẠM THỜI cho phép đọc/ghi công khai (Để dễ dev, sau này có thể siết lại)
CREATE POLICY "Cho phép tất cả thao tác trên statuses" ON public.statuses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên status_likes" ON public.status_likes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên status_comments" ON public.status_comments FOR ALL USING (true) WITH CHECK (true);

-- 6. Storage Bucket cho hình ảnh/video của status
INSERT INTO storage.buckets (id, name, public) 
VALUES ('status_media', 'status_media', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Policies cho Storage Bucket (Cho phép ai cũng có quyền upload, xem, xóa để dễ test)
CREATE POLICY "Public Access status" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'status_media');

CREATE POLICY "Public Upload status" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'status_media');

CREATE POLICY "Public Delete status" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'status_media');

CREATE POLICY "Public Update status" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'status_media');

-- 8. Functions to increment/decrement counters
CREATE OR REPLACE FUNCTION increment_status_likes(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.statuses SET likes_count = likes_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_status_likes(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.statuses SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_status_comments(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.statuses SET comments_count = comments_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
-- Bảng stories (Tin 24h)
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('text', 'image', 'video')),
    text_content TEXT,
    background_color TEXT DEFAULT '#000000',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '24 hours')
);

-- Bảng story_views (Lượt xem)
CREATE TABLE public.story_views (
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (story_id, viewer_id)
);

-- Kích hoạt RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

-- Cấp quyền công khai tạm thời
CREATE POLICY "Cho phép tất cả thao tác trên stories" ON public.stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên story_views" ON public.story_views FOR ALL USING (true) WITH CHECK (true);
-- Bảng user_likes (Lưu lịch sử vuốt thẻ)
CREATE TABLE public.user_likes (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_super_like BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, target_id)
);

-- Bảng user_blocks (Chặn người dùng)
CREATE TABLE public.user_blocks (
    blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- Bảng user_reports (Báo cáo vi phạm)
CREATE TABLE public.user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reported_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng dating_events (Lịch hẹn hò)
CREATE TABLE public.dating_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'upcoming', -- 'upcoming' hoặc 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kích hoạt RLS
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dating_events ENABLE ROW LEVEL SECURITY;

-- Cấp quyền công khai tạm thời
CREATE POLICY "Cho phép tất cả thao tác trên user_likes" ON public.user_likes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên user_blocks" ON public.user_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên user_reports" ON public.user_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép tất cả thao tác trên dating_events" ON public.dating_events FOR ALL USING (true) WITH CHECK (true);
