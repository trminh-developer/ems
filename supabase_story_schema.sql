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
