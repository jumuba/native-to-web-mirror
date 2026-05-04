-- Auth setup: tighten RLS so each user only sees their own data, and auto-create a profile row on signup.

-- USERS table: link rows to auth.uid via auth_user_id
DROP POLICY IF EXISTS "public insert users" ON public.users;
DROP POLICY IF EXISTS "public read users" ON public.users;
DROP POLICY IF EXISTS "public update users" ON public.users;

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid());

-- ALBUMS
DROP POLICY IF EXISTS "public all albums" ON public.albums;
ALTER TABLE public.albums ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users select own albums"
  ON public.albums FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own albums"
  ON public.albums FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own albums"
  ON public.albums FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users delete own albums"
  ON public.albums FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- PHOTOS
DROP POLICY IF EXISTS "public all photos" ON public.photos;
ALTER TABLE public.photos ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users select own photos"
  ON public.photos FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own photos"
  ON public.photos FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own photos"
  ON public.photos FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users delete own photos"
  ON public.photos FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- REMINDERS
DROP POLICY IF EXISTS "public all reminders" ON public.reminders;
ALTER TABLE public.reminders ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users select own reminders"
  ON public.reminders FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own reminders"
  ON public.reminders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own reminders"
  ON public.reminders FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users delete own reminders"
  ON public.reminders FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "public read subs" ON public.subscriptions;
DROP POLICY IF EXISTS "public insert subs" ON public.subscriptions;
DROP POLICY IF EXISTS "public update subs" ON public.subscriptions;
ALTER TABLE public.subscriptions ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users read own sub"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own sub"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own sub"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- SHARES
DROP POLICY IF EXISTS "public all shares" ON public.shares;
ALTER TABLE public.shares ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE POLICY "Users select own shares"
  ON public.shares FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users insert own shares"
  ON public.shares FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own shares"
  ON public.shares FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Trigger: auto-create a row in public.users when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();