import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, Star, BookOpen, Loader2 } from "lucide-react";
import { useBooks, useBorrowBook, useReserveBook } from "@/hooks/useLibraryData";
import { toast } from "sonner";

const genres = ["All", "Fiction", "Classic", "Dystopian", "Romance", "Fantasy", "Adventure", "Non-Fiction", "Sci-Fi", "Self-Help", "History"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const BrowseBooks = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const { data: books = [], isLoading } = useBooks();
  const [selectedBook, setSelectedBook] = useState<typeof books[0] | null>(null);

  const borrowBook = useBorrowBook();
  const reserveBook = useReserveBook();

  const handleAction = async (e: React.MouseEvent, book: typeof books[0] | null) => {
    e.stopPropagation();
    if (!book) return;
    try {
      if (book.availableCopies > 0) {
        await borrowBook.mutateAsync(book);
        toast.success(`Successfully borrowed ${book.title}!`);
      } else {
        await reserveBook.mutateAsync(book);
        toast.success(`Successfully reserved ${book.title}!`);
      }
      setSelectedBook(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to process request.");
    }
  };  const filtered = books.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "All" || b.genre.includes(genre);
    return matchSearch && matchGenre;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black">Browse Books</h1>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="brutal-input w-full pl-11 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("grid")} className={`brutal-btn rounded-md px-3 py-2 ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => setView("list")} className={`brutal-btn rounded-md px-3 py-2 ${view === "list" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`brutal-btn rounded-full px-4 py-1.5 text-sm font-heading ${genre === g ? "bg-accent text-accent-foreground" : "bg-background"}`}
          >
            {g}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <motion.div
          className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}
          variants={container}
          initial="hidden"
          animate="show"
          key={`${genre}-${search}-${view}`}
        >
          {filtered.map((book) => (
            <motion.div
              key={book.id}
              variants={item}
              className={`brutal-card rounded-lg cursor-pointer ${view === "list" ? "flex gap-4 p-4" : "p-4"}`}
              onClick={() => setSelectedBook(book)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`bg-muted brutal-border rounded-md flex items-center justify-center ${view === "list" ? "w-20 h-28 flex-shrink-0" : "w-full h-48 mb-3"}`}>
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.genre.map((g) => (
                    <span key={g} className="bg-muted px-2 py-0.5 text-xs font-bold rounded-full brutal-border">{g}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-bold">{book.rating}</span>
                  </div>
                  <span className={book.availableCopies > 0 ? "badge-available" : "badge-unavailable"}>
                    {book.availableCopies > 0 ? "Available" : "Unavailable"}
                  </span>
                </div>
                <button
                  className={`mt-3 brutal-btn w-full rounded-md text-sm font-heading ${book.availableCopies > 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
                  onClick={(e) => handleAction(e, book)}
                  disabled={borrowBook.isPending || reserveBook.isPending}
                >
                  {book.availableCopies > 0 ? "Borrow" : "Reserve"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-heading text-xl font-bold">No books found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Quick Preview Modal */}
      {selectedBook && (
        <motion.div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            className="brutal-card bg-card p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
            initial={{ y: 100, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-heading text-2xl font-black">{selectedBook.title}</h2>
                <p className="text-muted-foreground">{selectedBook.author}</p>
              </div>
              <button onClick={() => setSelectedBook(null)} className="brutal-btn bg-background rounded-md px-2 py-1 text-sm">✕</button>
            </div>
            <div className="w-full h-48 bg-muted brutal-border rounded-md flex items-center justify-center mb-4 overflow-hidden">
              {selectedBook.coverUrl ? (
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm mb-4">{selectedBook.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><span className="font-bold">ISBN:</span> {selectedBook.isbn}</div>
              <div><span className="font-bold">Pages:</span> {selectedBook.pages}</div>
              <div><span className="font-bold">Year:</span> {selectedBook.publishedYear}</div>
              <div><span className="font-bold">Location:</span> {selectedBook.location}</div>
              <div><span className="font-bold">Copies:</span> {selectedBook.availableCopies}/{selectedBook.totalCopies}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" /><span className="font-bold">{selectedBook.rating}</span> ({selectedBook.ratingCount})</div>
            </div>
            <button 
              className={`brutal-btn w-full rounded-md font-heading ${selectedBook.availableCopies > 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
              onClick={(e) => handleAction(e, selectedBook)}
              disabled={borrowBook.isPending || reserveBook.isPending}
            >
              {selectedBook.availableCopies > 0 ? "Borrow This Book" : "Reserve This Book"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BrowseBooks;
