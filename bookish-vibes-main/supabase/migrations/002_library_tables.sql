-- Books table
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  isbn text,
  genre text[] default '{}',
  description text,
  cover_url text default '',
  publisher text,
  published_year int,
  total_copies int not null default 1,
  available_copies int not null default 1,
  location text,
  language text default 'English',
  pages int,
  rating numeric(3,1) default 0,
  rating_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Borrows table
create table if not exists public.borrows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  book_title text not null,
  book_author text not null,
  borrowed_at date not null default current_date,
  due_date date not null,
  returned_at date,
  status text not null default 'active' check (status in ('active', 'overdue', 'returned')),
  fine_amount numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- Reservations table
create table if not exists public.reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  book_title text not null,
  status text not null default 'pending' check (status in ('pending', 'ready', 'cancelled', 'fulfilled')),
  reserved_at date not null default current_date,
  expires_at date not null,
  created_at timestamptz default now()
);

-- Notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  message text not null,
  type text not null default 'system' check (type in ('due_soon', 'overdue', 'ready', 'fine', 'system')),
  read boolean not null default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.books enable row level security;
alter table public.borrows enable row level security;
alter table public.reservations enable row level security;
alter table public.notifications enable row level security;

-- BOOKS: everyone can read, only admins can write
create policy "Anyone can view books" on public.books for select using (true);
create policy "Admins can insert books" on public.books for insert
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update books" on public.books for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete books" on public.books for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- BORROWS: users see their own, admins see all
create policy "Users can view own borrows" on public.borrows for select
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can insert borrows" on public.borrows for insert
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update borrows" on public.borrows for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- RESERVATIONS: users see their own, admins see all
create policy "Users can view own reservations" on public.reservations for select
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Users can insert own reservations" on public.reservations for insert
  with check (auth.uid() = user_id);
create policy "Users can update own reservations" on public.reservations for update
  using (auth.uid() = user_id);
create policy "Admins can manage reservations" on public.reservations for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- NOTIFICATIONS: users see their own, admins see all
create policy "Users can view own notifications" on public.notifications for select
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Users can update own notifications" on public.notifications for update
  using (auth.uid() = user_id);
create policy "Admins can insert notifications" on public.notifications for insert
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Seed books table with default data
insert into public.books (title, author, isbn, genre, description, publisher, published_year, total_copies, available_copies, location, language, pages, rating, rating_count)
values
  ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', '{"Fiction","Classic"}', 'A story of the mysteriously wealthy Jay Gatsby.', 'Scribner', 1925, 5, 3, 'Shelf A-12', 'English', 180, 4.5, 234),
  ('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', '{"Fiction","Classic"}', 'A gripping tale of racial injustice.', 'HarperCollins', 1960, 4, 0, 'Shelf A-15', 'English', 281, 4.8, 567),
  ('1984', 'George Orwell', '978-0451524935', '{"Fiction","Dystopian"}', 'A dystopian social science fiction novel.', 'Signet Classic', 1949, 6, 2, 'Shelf B-03', 'English', 328, 4.7, 890),
  ('Pride and Prejudice', 'Jane Austen', '978-0141439518', '{"Fiction","Romance"}', 'A romantic novel of manners.', 'Penguin', 1813, 3, 1, 'Shelf C-07', 'English', 432, 4.6, 445),
  ('The Hobbit', 'J.R.R. Tolkien', '978-0547928227', '{"Fantasy","Adventure"}', 'A fantasy novel and children''s book.', 'Houghton Mifflin', 1937, 4, 4, 'Shelf D-01', 'English', 310, 4.7, 678),
  ('Sapiens', 'Yuval Noah Harari', '978-0062316097', '{"Non-Fiction","History"}', 'A brief history of humankind.', 'Harper', 2011, 3, 2, 'Shelf E-09', 'English', 464, 4.4, 321),
  ('Dune', 'Frank Herbert', '978-0441172719', '{"Sci-Fi","Fiction"}', 'Set on the desert planet Arrakis.', 'Ace', 1965, 3, 1, 'Shelf D-05', 'English', 688, 4.6, 512),
  ('Atomic Habits', 'James Clear', '978-0735211292', '{"Non-Fiction","Self-Help"}', 'Tiny changes, remarkable results.', 'Avery', 2018, 5, 3, 'Shelf F-02', 'English', 320, 4.8, 1200)
on conflict do nothing;

-- Updated_at trigger for books
drop trigger if exists on_books_updated on public.books;
create trigger on_books_updated
  before update on public.books
  for each row execute procedure public.handle_updated_at();
