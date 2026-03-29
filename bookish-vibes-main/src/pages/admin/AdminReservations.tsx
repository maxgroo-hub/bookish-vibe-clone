import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Clock, Save, Loader2 } from "lucide-react";
import { useAdminAllReservations, useUpdateReservationStatus } from "@/hooks/useLibraryData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AdminReservations = () => {
  const [search, setSearch] = useState("");
  const { data: reservations = [], isLoading } = useAdminAllReservations();
  const updateStatus = useUpdateReservationStatus();

  const filtered = reservations.filter((r: any) =>
    r.bookTitle?.toLowerCase().includes(search.toLowerCase()) || 
    r.memberName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">Reservation Management</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reservations by book or member..." className="brutal-input w-full pl-11 rounded-md" />
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
                  <th className="text-left p-3 font-heading text-sm hidden sm:table-cell whitespace-nowrap">Reserved At</th>
                  <th className="text-left p-3 font-heading text-sm hidden md:table-cell whitespace-nowrap">Expires At</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Status</th>
                  <th className="text-left p-3 font-heading text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map((res: any) => (
                  <motion.tr key={res.id} variants={item} className="brutal-border border-x-0 border-b-0 last:border-b-0 hover:bg-muted/50">
                    <td className="p-3">
                      <span className="font-heading font-bold text-sm truncate max-w-[150px] inline-block" title={res.bookTitle}>{res.bookTitle}</span>
                    </td>
                    <td className="p-3 text-sm truncate max-w-[120px]" title={res.memberName}>{res.memberName}</td>
                    <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{res.reservedAt ? new Date(res.reservedAt).toLocaleDateString() : '—'}</td>
                    <td className="p-3 text-xs hidden md:table-cell">{res.expiresAt ? new Date(res.expiresAt).toLocaleDateString() : '—'}</td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase 
                        ${res.status === 'ready' ? 'bg-success/20 text-success' : 
                          res.status === 'pending' ? 'bg-warning/20 text-warning' : 
                          res.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 
                          'bg-primary/20 text-primary'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {res.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            title="Mark as Ready"
                            onClick={() => updateStatus.mutate({ id: res.id, status: "ready" })}
                            disabled={updateStatus.isPending}
                            className="brutal-btn bg-success text-success-foreground rounded-md p-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            title="Cancel Reservation"
                            onClick={() => updateStatus.mutate({ id: res.id, status: "cancelled" })}
                            disabled={updateStatus.isPending}
                            className="brutal-btn bg-destructive text-destructive-foreground rounded-md p-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {res.status === 'ready' && (
                        <div className="flex gap-2">
                          <button
                            title="Mark as Fulfilled (Checked out)"
                            onClick={() => updateStatus.mutate({ id: res.id, status: "fulfilled" })}
                            disabled={updateStatus.isPending}
                            className="brutal-btn bg-primary text-primary-foreground rounded-md p-1.5"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            title="Cancel Reservation"
                            onClick={() => updateStatus.mutate({ id: res.id, status: "cancelled" })}
                            disabled={updateStatus.isPending}
                            className="brutal-btn bg-destructive text-destructive-foreground rounded-md p-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="font-heading font-semibold">No reservations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
