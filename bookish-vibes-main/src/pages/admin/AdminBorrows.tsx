import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import { useAdminAllBorrows, useUpdateBorrowStatus } from "@/hooks/useLibraryData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AdminBorrows = () => {
  const [search, setSearch] = useState("");
  const { data: borrows = [], isLoading } = useAdminAllBorrows();
  const updateStatus = useUpdateBorrowStatus();

  const filtered = borrows.filter((b: any) =>
    b.bookTitle?.toLowerCase().includes(search.toLowerCase()) || 
    b.memberName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">Borrow Management</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search borrows by book or member..." className="brutal-input w-full pl-11 rounded-md" />
      </div>

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
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Book</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Member</th>
                  <th className="text-left p-3 font-heading text-sm hidden md:table-cell whitespace-nowrap">Borrowed</th>
                  <th className="text-left p-3 font-heading text-sm hidden sm:table-cell whitespace-nowrap">Due Date</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Status</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Fine</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map((borrow: any) => (
                  <motion.tr key={borrow.id} variants={item} className="brutal-border border-x-0 border-b-0 last:border-b-0 hover:bg-muted/50">
                    <td className="p-3">
                      <span className="font-heading font-bold text-sm truncate max-w-[150px] inline-block" title={borrow.bookTitle}>{borrow.bookTitle}</span>
                    </td>
                    <td className="p-3 text-sm truncate max-w-[120px]" title={borrow.memberName}>{borrow.memberName}</td>
                    <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{borrow.borrowedAt ? new Date(borrow.borrowedAt).toLocaleDateString() : '—'}</td>
                    <td className="p-3 text-xs hidden sm:table-cell">{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${borrow.status === 'returned' ? 'bg-success/20 text-success' : borrow.status === 'overdue' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                        {borrow.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold">${borrow.fineAmount?.toFixed(2) || '0.00'}</td>
                    <td className="p-3">
                      {borrow.status !== 'returned' && (
                        <div className="flex gap-2">
                          <button
                            title="Mark as returned"
                            onClick={() => updateStatus.mutate({ id: borrow.id, status: "returned" })}
                            disabled={updateStatus.isPending}
                            className="brutal-btn bg-success text-success-foreground rounded-md p-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          {borrow.status === 'active' && (
                            <button
                              title="Mark as overdue"
                              onClick={() => updateStatus.mutate({ id: borrow.id, status: "overdue" })}
                              disabled={updateStatus.isPending}
                              className="brutal-btn bg-destructive text-destructive-foreground rounded-md p-1.5"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <RotateCcw className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="font-heading font-semibold">No borrow records found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBorrows;
