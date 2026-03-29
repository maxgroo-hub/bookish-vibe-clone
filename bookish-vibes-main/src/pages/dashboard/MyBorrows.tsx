import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useMyBorrows } from "@/hooks/useLibraryData";

const tabs = ["Active", "History", "Overdue"] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

const MyBorrows = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Active");
  const { data: borrows = [], isLoading } = useMyBorrows();

  const filtered = borrows.filter((b) => {
    if (tab === "Active") return b.status === "active";
    if (tab === "Overdue") return b.status === "overdue";
    return b.status === "returned";
  });

  const statusIcon = (status: string) => {
    if (status === "active") return <Clock className="w-4 h-4 text-accent" />;
    if (status === "overdue") return <AlertTriangle className="w-4 h-4 text-destructive" />;
    return <CheckCircle className="w-4 h-4 text-success" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black">My Borrows</h1>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`brutal-btn rounded-md text-sm font-heading ${tab === t ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show" key={tab}>
          {filtered.map((b) => (
            <motion.div key={b.id} variants={item} className="brutal-card p-4 rounded-lg flex items-center gap-4">
              <div className="w-16 h-20 bg-muted brutal-border rounded-md flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold truncate">{b.bookTitle}</h3>
                <p className="text-sm text-muted-foreground">{b.bookAuthor}</p>
                <div className="flex items-center gap-4 mt-1 text-xs">
                  <span>Borrowed: {new Date(b.borrowedAt).toLocaleDateString()}</span>
                  <span>Due: {new Date(b.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-sm font-bold">
                  {statusIcon(b.status)}
                  <span className="capitalize">{b.status}</span>
                </div>
                {b.fineAmount > 0 && (
                  <span className="bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-bold rounded brutal-border">
                    ${b.fineAmount.toFixed(2)} fine
                  </span>
                )}
                {b.status === "active" && (
                  <button className="brutal-btn bg-primary text-primary-foreground rounded-md text-xs px-3 py-1 font-heading">
                    Return
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-heading text-lg font-bold">No {tab.toLowerCase()} borrows</h3>
          <p className="text-sm text-muted-foreground">Nothing to show here yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyBorrows;
