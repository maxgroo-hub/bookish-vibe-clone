import { motion } from "framer-motion";
import { BookOpen, Clock, AlertTriangle, CreditCard, Star } from "lucide-react";
import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";
import { useMyBorrows, useMyReservations } from "@/hooks/useLibraryData";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);
  const { data: borrows = [] } = useMyBorrows();
  const { data: reservations = [] } = useMyReservations();

  const activeBorrows = borrows.filter((b) => b.status === "active" || b.status === "overdue");
  const dueSoon = borrows.filter((b) => {
    if (b.status !== "active") return false;
    const days = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  });
  const totalFines = borrows.reduce((sum, b) => sum + (b.fineAmount || 0), 0);
  const activeReservations = reservations.filter((r) => r.status === "pending" || r.status === "ready");

  const stats = [
    { label: "Borrowed", value: String(activeBorrows.length), icon: BookOpen, color: "bg-primary" },
    { label: "Due Soon", value: String(dueSoon.length), icon: Clock, color: "bg-accent text-accent-foreground" },
    { label: "Reservations", value: String(activeReservations.length), icon: Star, color: "bg-success" },
    { label: "Fines", value: `$${totalFines.toFixed(2)}`, icon: CreditCard, color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        className="brutal-card bg-primary p-6 rounded-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
      >
        <h1 className="font-heading text-3xl font-black text-primary-foreground">
          Hello, {user?.fullName}! 👋
        </h1>
        <p className="text-primary-foreground/80 mt-1 font-body">
          Welcome back to your library dashboard.
        </p>
        <span className="inline-block mt-2 bg-foreground text-background px-3 py-1 text-xs font-heading font-bold rounded-md brutal-border">
          {user?.membershipType?.toUpperCase()} MEMBER
        </span>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item} className="brutal-card p-4 rounded-lg">
            <div className={`w-10 h-10 ${s.color} rounded-lg brutal-border flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="font-heading text-2xl font-black">{s.value}</div>
            <div className="text-sm text-muted-foreground font-semibold">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Currently Borrowed */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Currently Borrowed</h2>
        {activeBorrows.length === 0 ? (
          <div className="brutal-card p-8 rounded-lg text-center text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-heading font-semibold">No active borrows</p>
            <Link to="/dashboard/books" className="brutal-btn bg-primary text-primary-foreground rounded-md text-sm font-heading inline-block mt-4">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {activeBorrows.map((b) => {
              const daysLeft = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;
              return (
                <motion.div
                  key={b.id}
                  className="brutal-card p-4 rounded-lg min-w-[260px] flex-shrink-0"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-full h-32 bg-muted brutal-border rounded-md mb-3 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-sm truncate">{b.bookTitle}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{b.bookAuthor}</p>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isOverdue ? "text-destructive" : "text-foreground"}>
                      {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                    </span>
                    {isOverdue && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-2 brutal-border overflow-hidden">
                    <div
                      className={`h-full ${isOverdue ? "bg-destructive" : "bg-success"}`}
                      style={{ width: `${isOverdue ? 100 : Math.max(10, ((14 - daysLeft) / 14) * 100)}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/books" className="brutal-btn bg-primary text-primary-foreground rounded-md text-sm font-heading">
            Browse Books
          </Link>
          <Link to="/dashboard/borrows" className="brutal-btn bg-background rounded-md text-sm font-heading">
            View Borrows
          </Link>
          <Link to="/dashboard/notifications" className="brutal-btn bg-secondary text-secondary-foreground rounded-md text-sm font-heading">
            Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
