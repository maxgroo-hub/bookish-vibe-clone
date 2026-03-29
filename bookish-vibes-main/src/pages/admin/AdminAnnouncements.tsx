import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Send, Loader2 } from "lucide-react";
import { useSendAnnouncement, useAllMembers } from "@/hooks/useLibraryData";
import { toast } from "sonner";

const AdminAnnouncements = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUser, setTargetUser] = useState(""); 
  
  const { data: members = [] } = useAllMembers();
  const sendAnnouncement = useSendAnnouncement();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    try {
      await sendAnnouncement.mutateAsync({
        title,
        message,
        targetUserId: targetUser || null,
      });
      toast.success(targetUser ? "Notification sent successfully." : "Announcement broadcasted to all members.");
      setTitle("");
      setMessage("");
      setTargetUser("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send announcement.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-black">Announcements</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-card rounded-lg overflow-hidden p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">Send Broadcast</h2>
            <p className="text-sm text-muted-foreground">Send a system notification to members.</p>
          </div>
        </div>

        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="font-heading font-bold text-sm mb-1 block">Recipient</label>
            <select
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="brutal-input w-full rounded-md"
            >
              <option value="">All Members (Broadcast)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-heading font-bold text-sm mb-1 block">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Library Closed for Holidays"
              className="brutal-input w-full rounded-md"
            />
          </div>

          <div>
            <label className="font-heading font-bold text-sm mb-1 block">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="brutal-input w-full rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={sendAnnouncement.isPending || !title.trim() || !message.trim()}
            className="brutal-btn bg-primary text-primary-foreground font-heading rounded-md w-full flex items-center justify-center gap-2 py-3"
          >
            {sendAnnouncement.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sendAnnouncement.isPending ? "Sending..." : "Send Announcement"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAnnouncements;
