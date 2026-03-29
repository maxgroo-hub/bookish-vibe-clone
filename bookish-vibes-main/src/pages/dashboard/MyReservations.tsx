import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, BookOpen, Loader2 } from "lucide-react";
import { useMyReservations } from "@/hooks/useLibraryData";

const statusConfig = {
  pending: { icon: Clock, color: "bg-accent text-accent-foreground", label: "Pending" },
  ready: { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Ready for Pickup" },
  cancelled: { icon: XCircle, color: "bg-destructive text-destructive-foreground", label: "Cancelled" },
  fulfilled: { icon: CheckCircle, color: "bg-muted text-muted-foreground", label: "Fulfilled" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const MyReservations = () => {
  const { data: reservations = [], isLoading } = useMyReservations();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black">My Reservations</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-heading text-lg font-bold">No reservations</h3>
          <p className="text-sm text-muted-foreground">Reserve a book from the Browse page.</p>
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {reservations.map((r) => {
            const config = statusConfig[r.status] ?? statusConfig.pending;
            const Icon = config.icon;
            const daysLeft = Math.ceil((new Date(r.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div key={r.id} variants={item} className="brutal-card p-4 rounded-lg flex items-center gap-4">
                <div className="w-16 h-20 bg-muted brutal-border rounded-md flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold">{r.bookTitle}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reserved: {new Date(r.reservedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {daysLeft > 0 ? `Expires in ${daysLeft} days` : "Expired"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`${config.color} px-2 py-0.5 text-xs font-bold rounded brutal-border flex items-center gap-1`}>
                    <Icon className="w-3 h-3" /> {config.label}
                  </span>
                  {r.status === "pending" && (
                    <button className="brutal-btn bg-destructive text-destructive-foreground rounded-md text-xs px-3 py-1 font-heading">
                      Cancel
                    </button>
                  )}
                  {r.status === "ready" && (
                    <button className="brutal-btn bg-primary text-primary-foreground rounded-md text-xs px-3 py-1 font-heading">
                      Pick Up
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default MyReservations;
