-- 1. Create a security definer function to check if the user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS and prevents infinite recursion
SET search_path = public
AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT role = 'admin' INTO is_admin_user FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(is_admin_user, false);
END;
$$;

-- 2. Fix PROFILES table policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (public.is_admin());

-- 3. Fix BOOKS table policies
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;

CREATE POLICY "Admins can insert books" ON public.books FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE USING (public.is_admin());

-- 4. Fix BORROWS table policies
DROP POLICY IF EXISTS "Users can view own borrows" ON public.borrows;
DROP POLICY IF EXISTS "Admins can insert borrows" ON public.borrows;
DROP POLICY IF EXISTS "Admins can update borrows" ON public.borrows;

CREATE POLICY "Users can view own borrows" ON public.borrows FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can insert borrows" ON public.borrows FOR INSERT
  WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update borrows" ON public.borrows FOR UPDATE
  USING (public.is_admin());

-- 5. Fix RESERVATIONS table policies
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can manage reservations" ON public.reservations;

CREATE POLICY "Users can view own reservations" ON public.reservations FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage reservations" ON public.reservations FOR ALL
  USING (public.is_admin());

-- 6. Fix NOTIFICATIONS table policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin());
