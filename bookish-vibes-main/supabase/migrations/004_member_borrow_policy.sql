-- Allow users to insert their own borrow records
DROP POLICY IF EXISTS "Users can insert own borrows" ON public.borrows;
CREATE POLICY "Users can insert own borrows" ON public.borrows FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update books (specifically to decrement available copies when borrowing)
-- Note: In a production app, this should be an RPC function, but this allows the client-side mutation to work.
DROP POLICY IF EXISTS "Users can update book availability" ON public.books;
CREATE POLICY "Users can update book availability" ON public.books FOR UPDATE 
  USING (true)
  WITH CHECK (true);
