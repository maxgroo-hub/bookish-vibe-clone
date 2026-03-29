import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mockBooks, mockBorrows, mockReservations, mockNotifications } from "@/lib/mockData";
import { useAuthStore } from "@/store";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string[];
  description: string;
  coverUrl: string;
  publisher: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  language: string;
  pages: number;
  rating: number;
  ratingCount: number;
}

export interface Borrow {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: "active" | "overdue" | "returned";
  fineAmount: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  status: "pending" | "ready" | "cancelled" | "fulfilled";
  reservedAt: string;
  expiresAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "due_soon" | "overdue" | "ready" | "fine" | "system";
  read: boolean;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  membership: string;
  activeBorrows: number;
  fines: number;
  joined: string;
  active: boolean;
}

function mapBook(row: Record<string, unknown>): Book {
  return {
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    isbn: (row.isbn as string) || "",
    genre: (row.genre as string[]) || [],
    description: (row.description as string) || "",
    coverUrl: (row.cover_url as string) || "",
    publisher: (row.publisher as string) || "",
    publishedYear: (row.published_year as number) || 0,
    totalCopies: (row.total_copies as number) || 0,
    availableCopies: (row.available_copies as number) || 0,
    location: (row.location as string) || "",
    language: (row.language as string) || "English",
    pages: (row.pages as number) || 0,
    rating: Number(row.rating) || 0,
    ratingCount: (row.rating_count as number) || 0,
  };
}

function mapBorrow(row: Record<string, unknown>): Borrow {
  return {
    id: row.id as string,
    bookId: (row.book_id as string) || "",
    bookTitle: (row.book_title as string) || "",
    bookAuthor: (row.book_author as string) || "",
    borrowedAt: (row.borrowed_at as string) || "",
    dueDate: (row.due_date as string) || "",
    returnedAt: row.returned_at as string | undefined,
    status: (row.status as Borrow["status"]) || "active",
    fineAmount: Number(row.fine_amount) || 0,
  };
}

function mapReservation(row: Record<string, unknown>): Reservation {
  return {
    id: row.id as string,
    bookId: (row.book_id as string) || "",
    bookTitle: (row.book_title as string) || "",
    status: (row.status as Reservation["status"]) || "pending",
    reservedAt: (row.reserved_at as string) || "",
    expiresAt: (row.expires_at as string) || "",
  };
}

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    title: (row.title as string) || "",
    message: (row.message as string) || "",
    type: (row.type as Notification["type"]) || "system",
    read: (row.read as boolean) || false,
    createdAt: (row.created_at as string) || "",
  };
}

function useIsGuest() {
  const user = useAuthStore((s) => s.user);
  return !user || user.isGuest === true;
}

export function useBooks() {
  const isGuest = useIsGuest();
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      if (isGuest) return mockBooks.map((b) => ({ ...b, coverUrl: b.coverUrl || "" }));
      const { data, error } = await supabase.from("books").select("*").order("title");
      if (error) throw error;
      return (data || []).map(mapBook);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useMyBorrows() {
  const user = useAuthStore((s) => s.user);
  const isGuest = useIsGuest();
  return useQuery<Borrow[]>({
    queryKey: ["borrows", user?.id],
    queryFn: async () => {
      if (isGuest) return mockBorrows;
      const { data, error } = await supabase
        .from("borrows")
        .select("*")
        .eq("user_id", user!.id)
        .order("borrowed_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapBorrow);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyReservations() {
  const user = useAuthStore((s) => s.user);
  const isGuest = useIsGuest();
  return useQuery<Reservation[]>({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      if (isGuest) return mockReservations;
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", user!.id)
        .order("reserved_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapReservation);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyNotifications() {
  const user = useAuthStore((s) => s.user);
  const isGuest = useIsGuest();
  return useQuery<Notification[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (isGuest) return mockNotifications;
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNotification);
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user || user.isGuest) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async () => {
      if (!user || user.isGuest) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [booksRes, membersRes, borrowsRes, overdueRes, finesRes] = await Promise.all([
        supabase.from("books").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "member"),
        supabase.from("borrows").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("borrows").select("id", { count: "exact", head: true }).eq("status", "overdue"),
        supabase.from("borrows").select("fine_amount").gt("fine_amount", 0),
      ]);

      const totalFines = (finesRes.data || []).reduce(
        (sum: number, r: Record<string, unknown>) => sum + (Number(r.fine_amount) || 0),
        0
      );

      return {
        totalBooks: booksRes.count ?? 0,
        totalMembers: membersRes.count ?? 0,
        activeBorrows: borrowsRes.count ?? 0,
        overdue: overdueRes.count ?? 0,
        finesRevenue: totalFines,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminBorrowsChart() {
  return useQuery({
    queryKey: ["admin-borrows-chart"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 13);
      const { data, error } = await supabase
        .from("borrows")
        .select("borrowed_at")
        .gte("borrowed_at", since.toISOString().split("T")[0]);
      if (error) throw error;

      const counts: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        counts[key] = 0;
      }
      (data || []).forEach((r: Record<string, unknown>) => {
        const key = new Date(r.borrowed_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (key in counts) counts[key]++;
      });
      return Object.entries(counts).map(([day, borrows]) => ({ day, borrows }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopBooks() {
  return useQuery({
    queryKey: ["top-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("borrows")
        .select("book_title");
      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((r: Record<string, unknown>) => {
        const t = r.book_title as string;
        counts[t] = (counts[t] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, borrows]) => ({ title, borrows }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllMembers() {
  return useQuery<Member[]>({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "member")
        .order("created_at", { ascending: false });
      if (profErr) throw profErr;

      const memberIds = (profiles || []).map((p: Record<string, unknown>) => p.id as string);

      const { data: borrows } = await supabase
        .from("borrows")
        .select("user_id, fine_amount, status")
        .in("user_id", memberIds.length > 0 ? memberIds : ["none"]);

      const borrowMap: Record<string, { active: number; fines: number }> = {};
      (borrows || []).forEach((b: Record<string, unknown>) => {
        const uid = b.user_id as string;
        if (!borrowMap[uid]) borrowMap[uid] = { active: 0, fines: 0 };
        if (b.status === "active" || b.status === "overdue") borrowMap[uid].active++;
        borrowMap[uid].fines += Number(b.fine_amount) || 0;
      });

      return (profiles || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: (p.full_name as string) || "—",
        email: (p.email as string) || "—",
        membership: (p.membership_type as string) || "basic",
        activeBorrows: borrowMap[p.id as string]?.active || 0,
        fines: borrowMap[p.id as string]?.fines || 0,
        joined: new Date(p.created_at as string).toISOString().split("T")[0],
        active: true,
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminAllBooks() {
  return useQuery<Book[]>({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title");
      if (error) throw error;
      return (data || []).map(mapBook);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Partial<Book>) => {
      const { error } = await supabase.from("books").insert({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        description: book.description,
        published_year: book.publishedYear,
        total_copies: book.totalCopies || 1,
        available_copies: book.totalCopies || 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Partial<Book> & { id: string }) => {
      const { error } = await supabase.from("books").update({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        description: book.description,
        published_year: book.publishedYear,
        total_copies: book.totalCopies,
        available_copies: book.availableCopies,
      }).eq("id", book.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useBorrowBook() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (book: Book) => {
      if (!user || user.isGuest) throw new Error("Must be logged in to borrow");
      if (book.availableCopies <= 0) throw new Error("No copies available");
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const { error: insertErr } = await supabase.from("borrows").insert({
        user_id: user.id,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        due_date: dueDate.toISOString().split("T")[0],
        status: "active"
      });
      if (insertErr) throw insertErr;
      
      const { error: updateErr } = await supabase.from("books")
        .update({ available_copies: book.availableCopies - 1 })
        .eq("id", book.id);
      if (updateErr) throw updateErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
    }
  });
}

export function useReserveBook() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async (book: Book) => {
      if (!user || user.isGuest) throw new Error("Must be logged in to reserve");
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const { error } = await supabase.from("reservations").insert({
        user_id: user.id,
        book_id: book.id,
        book_title: book.title,
        status: "pending",
        expires_at: expiresAt.toISOString().split("T")[0]
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    }
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (member: Partial<Member> & { id: string }) => {
      const { error } = await supabase.from("profiles").update({
        full_name: member.name,
        email: member.email,
        membership_type: member.membership,
      }).eq("id", member.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
  });
}

export function useAdminRecentActivity() {
  return useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("borrows")
        .select("user_id, book_title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) return [];
      
      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      const profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
        (profs || []).forEach((p: any) => { profileMap[p.id] = p.full_name; });
      }

      return (data || []).map((r: Record<string, unknown>) => {
        const name = profileMap[r.user_id as string] || "A member";
        const verb = r.status === "returned" ? "returned" : "borrowed";
        return `${name} ${verb} ${r.book_title}`;
      });
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}

// --- Admin Features Hooks ---

export function useAdminAllBorrows() {
  return useQuery({
    queryKey: ["admin-all-borrows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("borrows")
        .select("*")
        .order("borrowed_at", { ascending: false });
      if (error) throw error;
      
      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      const profileMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        (profs || []).forEach((p: any) => { profileMap[p.id] = p; });
      }

      return (data || []).map((row: any) => ({
        ...mapBorrow(row),
        memberName: profileMap[row.user_id]?.full_name || "Unknown",
        memberEmail: profileMap[row.user_id]?.email || "No Email",
        userId: row.user_id,
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateBorrowStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, fineAmount }: { id: string; status: "active" | "overdue" | "returned"; fineAmount?: number }) => {
      const updateData: any = { status };
      if (status === "returned") updateData.returned_at = new Date().toISOString().split("T")[0];
      if (fineAmount !== undefined) updateData.fine_amount = fineAmount;
      
      const { error } = await supabase.from("borrows").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });
}

export function useAdminAllReservations() {
  return useQuery({
    queryKey: ["admin-all-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reserved_at", { ascending: false });
      if (error) throw error;
      
      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      const profileMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        (profs || []).forEach((p: any) => { profileMap[p.id] = p; });
      }

      return (data || []).map((row: any) => ({
        ...mapReservation(row),
        memberName: profileMap[row.user_id]?.full_name || "Unknown",
        memberEmail: profileMap[row.user_id]?.email || "No Email",
        userId: row.user_id,
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "ready" | "cancelled" | "fulfilled" }) => {
      const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-reservations"] });
    },
  });
}

export function useAdminAllFines() {
  return useQuery({
    queryKey: ["admin-all-fines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("borrows")
        .select("*")
        .gt("fine_amount", 0)
        .order("borrowed_at", { ascending: false });
      if (error) throw error;
      
      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      const profileMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        (profs || []).forEach((p: any) => { profileMap[p.id] = p; });
      }

      return (data || []).map((row: any) => ({
        ...mapBorrow(row),
        memberName: profileMap[row.user_id]?.full_name || "Unknown",
        memberEmail: profileMap[row.user_id]?.email || "No Email",
        userId: row.user_id,
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useSendAnnouncement() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: async ({ title, message, targetUserId }: { title: string; message: string; targetUserId?: string | null }) => {
      if (!user) throw new Error("Not logged in");
      
      if (targetUserId) {
        const { error } = await supabase.from("notifications").insert({
          user_id: targetUserId,
          title,
          message,
          type: "system",
        });
        if (error) throw error;
      } else {
        const { data: members, error: memErr } = await supabase.from("profiles").select("id").eq("role", "member");
        if (memErr) throw memErr;
        
        if (members && members.length > 0) {
          const inserts = members.map((m: any) => ({
            user_id: m.id,
            title,
            message,
            type: "system",
          }));
          const { error: insertErr } = await supabase.from("notifications").insert(inserts);
          if (insertErr) throw insertErr;
        }
      }
    },
  });
}
