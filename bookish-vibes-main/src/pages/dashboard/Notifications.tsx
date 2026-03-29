import { motion } from "framer-motion";
import { Bell, AlertTriangle, Clock, CheckCircle, Info, Check, Loader2 } from "lucide-react";
import { useMyNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/useLibraryData";
import { useAuthStore } from "@/store";

const typeConfig = {
  due_soon: { icon: Clock, color: "border-l-4 border-l-accent" },
  overdue: { icon: AlertTriangle, color: "border-l-4 border-l-destructive" },
  ready: { icon: CheckCircle, color: "border-l-4 border-l-success" },
  fine: { icon: AlertTriangle, color: "border-l-4 border-l-primary" },
  system: { icon: Info, color: "border-l-4 border-l-muted-foreground" },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } };

const Notifications = () => {
  const user = useAuthStore((s) => s.user);
  const isGuest = !user || user.isGuest;
  const { data: notifications = [], isLoading } = useMyNotifications();
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-black">Notifications</h1>
        {!isGuest && (
          <button
            className="brutal-btn bg-background rounded-md text-sm font-heading flex items-center gap-2"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
          >
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-heading text-lg font-bold">No notifications</h3>
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {notifications.map((n) => {
            const config = typeConfig[n.type] ?? typeConfig.system;
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                variants={item}
                className={`brutal-card p-4 rounded-lg ${config.color} ${n.read ? "opacity-60" : ""} cursor-pointer`}
                onClick={() => { if (!isGuest && !n.read) markOne.mutate(n.id); }}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-sm">{n.title}</h3>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-2" />
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

export default Notifications;
