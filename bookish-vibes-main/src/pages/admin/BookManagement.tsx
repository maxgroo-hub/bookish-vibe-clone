import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, BookOpen, Upload, Download, Loader2 } from "lucide-react";
import { useAdminAllBooks, useAddBook, useDeleteBook, useUpdateBook } from "@/hooks/useLibraryData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const BookManagement = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", publisher: "", description: "", year: "", copies: "1" });
  const [editBook, setEditBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", author: "", isbn: "", publisher: "", description: "", year: "", copies: "1", id: "" });
  const [actionError, setActionError] = useState("");

  const { data: books = [], isLoading } = useAdminAllBooks();
  const addBook = useAddBook();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    setActionError("");
    if (!form.title || !form.author) return;
    const publishedYear = Number(form.year);
    const totalCopies = Number(form.copies);
    try {
      await addBook.mutateAsync({
        title: form.title,
        author: form.author,
        isbn: form.isbn,
        publisher: form.publisher,
        description: form.description,
        publishedYear: isNaN(publishedYear) ? 0 : publishedYear,
        totalCopies: isNaN(totalCopies) ? 1 : totalCopies,
      });
      setForm({ title: "", author: "", isbn: "", publisher: "", description: "", year: "", copies: "1" });
      setShowAddModal(false);
    } catch (err) {
      setActionError(err?.message || JSON.stringify(err));
      console.error("Add book error:", err);
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setEditForm({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      publisher: book.publisher || "",
      description: book.description || "",
      year: book.publishedYear ? String(book.publishedYear) : "",
      copies: book.totalCopies ? String(book.totalCopies) : "1",
      id: book.id,
    });
  };

  const handleEditSave = async () => {
    setActionError("");
    const publishedYear = Number(editForm.year);
    const totalCopies = Number(editForm.copies);
    try {
      await updateBook.mutateAsync({
        id: editForm.id,
        title: editForm.title,
        author: editForm.author,
        isbn: editForm.isbn,
        publisher: editForm.publisher,
        description: editForm.description,
        publishedYear: isNaN(publishedYear) ? 0 : publishedYear,
        totalCopies: isNaN(totalCopies) ? 1 : totalCopies,
        availableCopies: isNaN(totalCopies) ? 1 : totalCopies,
      });
      setEditBook(null);
    } catch (err) {
      setActionError(err?.message || JSON.stringify(err));
      console.error("Edit book error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">Book Management</h1>
        <div className="flex gap-2">
          <button className="brutal-btn bg-background rounded-md text-sm font-heading flex items-center gap-1">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button className="brutal-btn bg-background rounded-md text-sm font-heading flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="brutal-btn bg-primary text-primary-foreground rounded-md text-sm font-heading flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="brutal-input w-full pl-11 rounded-md" />
      </div>

      {/* Table */}
      <div className="brutal-card rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="brutal-border border-t-0 border-x-0 bg-muted">
                  <th className="text-left p-3 font-heading text-sm">Title</th>
                  <th className="text-left p-3 font-heading text-sm hidden sm:table-cell">Author</th>
                  <th className="text-left p-3 font-heading text-sm hidden md:table-cell">ISBN</th>
                  <th className="text-left p-3 font-heading text-sm">Copies</th>
                  <th className="text-left p-3 font-heading text-sm hidden lg:table-cell">Location</th>
                  <th className="text-left p-3 font-heading text-sm">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map((book) => (
                  <motion.tr key={book.id} variants={item} className="brutal-border border-x-0 border-b-0 last:border-b-0 hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-10 bg-muted brutal-border rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-heading font-bold text-sm truncate max-w-[150px]">{book.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm hidden sm:table-cell">{book.author}</td>
                    <td className="p-3 text-xs text-muted-foreground hidden md:table-cell font-mono">{book.isbn}</td>
                    <td className="p-3">
                      <span className={`text-sm font-bold ${book.availableCopies > 0 ? "text-success" : "text-destructive"}`}>
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                    </td>
                    <td className="p-3 text-xs hidden lg:table-cell">{book.location}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="brutal-btn bg-background rounded-md p-1.5" onClick={() => handleEdit(book)}><Edit className="w-4 h-4" /></button>
                        <button
                          className="brutal-btn bg-destructive text-destructive-foreground rounded-md p-1.5"
                          onClick={async () => {
                            setActionError("");
                            try {
                              if (book.id) await deleteBook.mutateAsync(book.id);
                            } catch (err) {
                              setActionError(err?.message || JSON.stringify(err));
                              console.error("Delete book error:", err);
                            }
                          }}
                          disabled={deleteBook.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="font-heading font-semibold">No books found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            className="brutal-card bg-card p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-2xl font-black mb-4">Add New Book</h2>
            <div className="space-y-3">
              {(["title", "author", "isbn", "publisher"] as const).map((field) => (
                <div key={field}>
                  <label className="font-heading font-bold text-sm mb-1 block capitalize">{field}</label>
                  <input
                    className="brutal-input w-full rounded-md"
                    placeholder={`Enter ${field}...`}
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="font-heading font-bold text-sm mb-1 block">Description</label>
                <textarea
                  className="brutal-input w-full rounded-md"
                  rows={3}
                  placeholder="Enter description..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-sm mb-1 block">Year</label>
                  <input
                    type="number"
                    className="brutal-input w-full rounded-md"
                    placeholder="2024"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-heading font-bold text-sm mb-1 block">Copies</label>
                  <input
                    type="number"
                    className="brutal-input w-full rounded-md"
                    placeholder="1"
                    value={form.copies}
                    onChange={(e) => setForm((f) => ({ ...f, copies: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading flex-1 flex items-center justify-center gap-2"
                  onClick={handleAdd}
                  disabled={addBook.isPending || !form.title || !form.author}
                >
                  {addBook.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Book
                </button>
                <button onClick={() => setShowAddModal(false)} className="brutal-btn bg-background rounded-md font-heading">Cancel</button>
              </div>
              {addBook.isError && (
                <p className="text-destructive text-sm font-heading">Failed to add book. Try again.</p>
              )}
              {actionError && (
                <p className="text-destructive text-sm font-heading">{actionError}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Book Modal */}
      {editBook && (
        <motion.div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEditBook(null)}
        >
          <motion.div
            className="brutal-card bg-card p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-2xl font-black mb-4">Edit Book</h2>
            <div className="space-y-3">
              {(["title", "author", "isbn", "publisher"] as const).map((field) => (
                <div key={field}>
                  <label className="font-heading font-bold text-sm mb-1 block capitalize">{field}</label>
                  <input
                    className="brutal-input w-full rounded-md"
                    placeholder={`Enter ${field}...`}
                    value={editForm[field]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="font-heading font-bold text-sm mb-1 block">Description</label>
                <textarea
                  className="brutal-input w-full rounded-md"
                  rows={3}
                  placeholder="Enter description..."
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-sm mb-1 block">Year</label>
                  <input
                    type="number"
                    className="brutal-input w-full rounded-md"
                    placeholder="2024"
                    value={editForm.year}
                    onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-heading font-bold text-sm mb-1 block">Copies</label>
                  <input
                    type="number"
                    className="brutal-input w-full rounded-md"
                    placeholder="1"
                    value={editForm.copies}
                    onChange={(e) => setEditForm((f) => ({ ...f, copies: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading flex-1 flex items-center justify-center gap-2"
                  onClick={handleEditSave}
                  disabled={updateBook.isPending || !editForm.title || !editForm.author}
                >
                  {updateBook.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
                <button onClick={() => setEditBook(null)} className="brutal-btn bg-background rounded-md font-heading">Cancel</button>
              </div>
              {updateBook.isError && (
                <p className="text-destructive text-sm font-heading">Failed to update book. Try again.</p>
              )}
              {actionError && (
                <p className="text-destructive text-sm font-heading">{actionError}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BookManagement;
