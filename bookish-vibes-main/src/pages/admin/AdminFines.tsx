import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, RotateCcw, Loader2 } from "lucide-react";
import { useAdminAllFines, useUpdateBorrowStatus } from "@/hooks/useLibraryData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AdminFines = () => {
  const [search, setSearch] = useState("");
  const { data: fines = [], isLoading } = useAdminAllFines();
  const updateStatus = useUpdateBorrowStatus();

  const filtered = fines.filter((f: any) =>
    f.memberName?.toLowerCase().includes(search.toLowerCase()) || 
    f.bookTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">Fines Management</h1>
      </div>

      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fines by member or book..." className="brutal-input w-full pl-11 rounded-md" />
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
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Member</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Book</th>
                  <th className="text-left p-3 font-heading text-sm hidden md:table-cell whitespace-nowrap">Borrowed At</th>
                  <th className="text-left p-3 font-heading text-sm hidden sm:table-cell whitespace-nowrap">Due Date</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Fine Amount</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map((fine: any) => (
                  <motion.tr key={fine.id} variants={item} className="brutal-border border-x-0 border-b-0 last:border-b-0 hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-sm truncate max-w-[150px]" title={fine.memberName}>{fine.memberName}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={fine.memberEmail}>{fine.memberEmail}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm truncate max-w-[120px]" title={fine.bookTitle}>{fine.bookTitle}</td>
                    <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{fine.borrowedAt ? new Date(fine.borrowedAt).toLocaleDateString() : '—'}</td>
                    <td className="p-3 text-xs hidden sm:table-cell">{fine.dueDate ? new Date(fine.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="p-3">
                      <span className="text-sm font-bold text-destructive">${fine.fineAmount?.toFixed(2)}</span>
                    </td>
                    <td className="p-3">
                      <button
                        title="Clear Fine (Mark as Paid)"
                        onClick={() => updateStatus.mutate({ id: fine.id, status: fine.status, fineAmount: 0 })}
                        disabled={updateStatus.isPending}
                        className="brutal-btn bg-success text-success-foreground rounded-md px-3 py-1.5 text-xs font-bold"
                      >
                        Clear Fine
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <RotateCcw className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="font-heading font-semibold">No outstanding fines</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFines;
