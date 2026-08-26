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
