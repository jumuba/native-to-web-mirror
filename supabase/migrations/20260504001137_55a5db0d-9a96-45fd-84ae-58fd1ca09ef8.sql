
-- Timestamp helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- USERS (profile)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "public update users" ON public.users FOR UPDATE USING (true);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ALBUMS
CREATE TABLE public.albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  category TEXT,
  theme TEXT,
  cover_image TEXT,
  is_private BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  photo_count INT DEFAULT 0,
  music TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public all albums" ON public.albums FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_albums_updated BEFORE UPDATE ON public.albums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PHOTOS
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
  user_id UUID,
  url TEXT NOT NULL,
  title TEXT,
  place TEXT,
  event TEXT,
  taken_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public all photos" ON public.photos FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_photos_album ON public.photos(album_id);

-- REMINDERS
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT,
  remind_at DATE,
  linked_to UUID,
  linked_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public all reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);

-- SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read subs" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "public insert subs" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "public update subs" ON public.subscriptions FOR UPDATE USING (true);
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SHARES
CREATE TABLE public.shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public all shares" ON public.shares FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX idx_shares_token ON public.shares(token);
