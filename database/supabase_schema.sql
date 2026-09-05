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
