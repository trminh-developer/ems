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
