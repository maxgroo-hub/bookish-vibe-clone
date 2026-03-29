export const mockBooks = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", genre: ["Fiction", "Classic"], description: "A story of the mysteriously wealthy Jay Gatsby.", coverUrl: "", publisher: "Scribner", publishedYear: 1925, totalCopies: 5, availableCopies: 3, location: "Shelf A-12", language: "English", pages: 180, rating: 4.5, ratingCount: 234 },
  { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0061120084", genre: ["Fiction", "Classic"], description: "A gripping tale of racial injustice.", coverUrl: "", publisher: "HarperCollins", publishedYear: 1960, totalCopies: 4, availableCopies: 0, location: "Shelf A-15", language: "English", pages: 281, rating: 4.8, ratingCount: 567 },
  { id: "3", title: "1984", author: "George Orwell", isbn: "978-0451524935", genre: ["Fiction", "Dystopian"], description: "A dystopian social science fiction novel.", coverUrl: "", publisher: "Signet Classic", publishedYear: 1949, totalCopies: 6, availableCopies: 2, location: "Shelf B-03", language: "English", pages: 328, rating: 4.7, ratingCount: 890 },
  { id: "4", title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0141439518", genre: ["Fiction", "Romance"], description: "A romantic novel of manners.", coverUrl: "", publisher: "Penguin", publishedYear: 1813, totalCopies: 3, availableCopies: 1, location: "Shelf C-07", language: "English", pages: 432, rating: 4.6, ratingCount: 445 },
  { id: "5", title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227", genre: ["Fantasy", "Adventure"], description: "A fantasy novel and children's book.", coverUrl: "", publisher: "Houghton Mifflin", publishedYear: 1937, totalCopies: 4, availableCopies: 4, location: "Shelf D-01", language: "English", pages: 310, rating: 4.7, ratingCount: 678 },
  { id: "6", title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", genre: ["Non-Fiction", "History"], description: "A brief history of humankind.", coverUrl: "", publisher: "Harper", publishedYear: 2011, totalCopies: 3, availableCopies: 2, location: "Shelf E-09", language: "English", pages: 464, rating: 4.4, ratingCount: 321 },
  { id: "7", title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", genre: ["Sci-Fi", "Fiction"], description: "Set on the desert planet Arrakis.", coverUrl: "", publisher: "Ace", publishedYear: 1965, totalCopies: 3, availableCopies: 1, location: "Shelf D-05", language: "English", pages: 688, rating: 4.6, ratingCount: 512 },
  { id: "8", title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", genre: ["Non-Fiction", "Self-Help"], description: "Tiny changes, remarkable results.", coverUrl: "", publisher: "Avery", publishedYear: 2018, totalCopies: 5, availableCopies: 3, location: "Shelf F-02", language: "English", pages: 320, rating: 4.8, ratingCount: 1200 },
];

export const mockBorrows = [
  { id: "b1", bookId: "1", bookTitle: "The Great Gatsby", bookAuthor: "F. Scott Fitzgerald", borrowedAt: "2026-03-15", dueDate: "2026-04-05", status: "active" as const, fineAmount: 0 },
  { id: "b2", bookId: "3", bookTitle: "1984", bookAuthor: "George Orwell", borrowedAt: "2026-03-10", dueDate: "2026-03-24", status: "overdue" as const, fineAmount: 2.5 },
  { id: "b3", bookId: "5", bookTitle: "The Hobbit", bookAuthor: "J.R.R. Tolkien", borrowedAt: "2026-02-20", dueDate: "2026-03-06", returnedAt: "2026-03-04", status: "returned" as const, fineAmount: 0 },
];

export const mockNotifications = [
  { id: "n1", title: "Book Due Soon", message: "The Great Gatsby is due in 3 days.", type: "due_soon" as const, read: false, createdAt: "2026-03-25" },
  { id: "n2", title: "Book Overdue", message: "1984 is overdue. Please return it ASAP.", type: "overdue" as const, read: false, createdAt: "2026-03-25" },
  { id: "n3", title: "Reservation Ready", message: "Your reservation for Dune is ready for pickup.", type: "ready" as const, read: true, createdAt: "2026-03-23" },
  { id: "n4", title: "Welcome!", message: "Welcome to LibraVault. Start exploring our collection!", type: "system" as const, read: true, createdAt: "2026-03-01" },
];

export const mockReservations = [
  { id: "r1", bookId: "7", bookTitle: "Dune", status: "ready" as const, reservedAt: "2026-03-20", expiresAt: "2026-03-30" },
  { id: "r2", bookId: "2", bookTitle: "To Kill a Mockingbird", status: "pending" as const, reservedAt: "2026-03-22", expiresAt: "2026-04-01" },
];
