-- 1. Đảm bảo có Bucket status_media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('status_media', 'status_media', true) 
ON CONFLICT (id) DO NOTHING;

-- Xoá policy cũ nếu có để tránh lỗi
DROP POLICY IF EXISTS "Public Access status_media" ON storage.objects;
DROP POLICY IF EXISTS "Auth Users Upload status_media" ON storage.objects;

-- Cho phép mọi người xem ảnh trong bucket status_media
CREATE POLICY "Public Access status_media" ON storage.objects 
FOR SELECT USING (bucket_id = 'status_media');

-- Cho phép người dùng đăng nhập được upload ảnh (dùng anon cho dev)
CREATE POLICY "Auth Users Upload status_media" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'status_media' AND auth.role() = 'anon');

-- 2. Đảm bảo bảng user_preferences tồn tại
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    preferred_gender TEXT[] DEFAULT '{}',
    age_min INTEGER DEFAULT 18,
    age_max INTEGER DEFAULT 99,
    max_distance INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies cho user_preferences
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép tất cả thao tác trên user_preferences' AND tablename = 'user_preferences') THEN
    CREATE POLICY "Cho phép tất cả thao tác trên user_preferences" ON public.user_preferences FOR ALL USING (true);
  END IF;
END $$;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Đảm bảo bảng user_likes tồn tại
CREATE TABLE IF NOT EXISTS public.user_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_super_like BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_id)
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép tất cả thao tác trên user_likes' AND tablename = 'user_likes') THEN
    CREATE POLICY "Cho phép tất cả thao tác trên user_likes" ON public.user_likes FOR ALL USING (true);
  END IF;
END $$;
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- 4. Bảng matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    matched_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_percentage INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT true,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, matched_user_id)
);

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép tất cả thao tác trên matches' AND tablename = 'matches') THEN
    CREATE POLICY "Cho phép tất cả thao tác trên matches" ON public.matches FOR ALL USING (true);
  END IF;
END $$;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 5. Bảng user_blocks & user_reports
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép tất cả thao tác trên user_blocks') THEN CREATE POLICY "Cho phép tất cả thao tác trên user_blocks" ON public.user_blocks FOR ALL USING (true); END IF; END $$;

CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reported_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép tất cả thao tác trên user_reports') THEN CREATE POLICY "Cho phép tất cả thao tác trên user_reports" ON public.user_reports FOR ALL USING (true); END IF; END $$;

-- 6. Reload schema
NOTIFY pgrst, 'reload schema';
