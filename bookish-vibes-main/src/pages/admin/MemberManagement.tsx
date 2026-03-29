import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Ban, Loader2 } from "lucide-react";
import { useAllMembers, useUpdateMember, useDeleteMember } from "@/hooks/useLibraryData";

const membershipColors: Record<string, string> = {
  basic: "bg-muted text-foreground",
  premium: "bg-primary text-primary-foreground",
  vip: "bg-secondary text-secondary-foreground",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const MemberManagement = () => {
  const [search, setSearch] = useState("");
  const { data: members = [], isLoading } = useAllMembers();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const [editMember, setEditMember] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", membership: "basic", id: "" });

  const handleEdit = (member) => {
    setEditMember(member);
    setEditForm({
      name: member.name || "",
      email: member.email || "",
      membership: member.membership || "basic",
      id: member.id,
    });
  };

  const handleEditSave = async () => {
    await updateMember.mutateAsync({
      id: editForm.id,
      name: editForm.name,
      email: editForm.email,
      membership: editForm.membership,
    });
    setEditMember(null);
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-black">Member Management</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="brutal-input w-full pl-11 rounded-md" />
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
                  <th className="text-left p-3 font-heading text-sm">Member</th>
                  <th className="text-left p-3 font-heading text-sm hidden md:table-cell">Membership</th>
                  <th className="text-left p-3 font-heading text-sm hidden sm:table-cell">Borrows</th>
                  <th className="text-left p-3 font-heading text-sm hidden lg:table-cell">Fines</th>
                  <th className="text-left p-3 font-heading text-sm">Status</th>
                  <th className="text-left p-3 font-heading text-sm">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={container} initial="hidden" animate="show">
                {filtered.map((m) => (
                  <motion.tr key={m.id} variants={item} className="brutal-border border-x-0 border-b-0 hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent brutal-border rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-heading font-bold text-xs text-accent-foreground">{m.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-heading font-bold text-sm">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={`${membershipColors[m.membership] ?? membershipColors.basic} px-2 py-0.5 text-xs font-bold rounded brutal-border uppercase`}>
                        {m.membership}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold hidden sm:table-cell">{m.activeBorrows}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <span className={`text-sm font-bold ${m.fines > 0 ? "text-destructive" : "text-success"}`}>
                        ${m.fines.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3">
                      {m.active ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-success"><CheckCircle className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-destructive"><Ban className="w-3 h-3" /> Suspended</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button className="brutal-btn bg-background rounded-md text-xs px-3 py-1 font-heading mr-1" onClick={() => handleEdit(m)}>
                        Edit
                      </button>
                      <button className="brutal-btn bg-destructive text-destructive-foreground rounded-md text-xs px-3 py-1 font-heading" onClick={() => deleteMember.mutate(m.id)} disabled={deleteMember.isPending}>
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-heading font-semibold">No members found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Member Modal */}
      {editMember && (
        <motion.div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEditMember(null)}
        >
          <motion.div
            className="brutal-card bg-card p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-2xl font-black mb-4">Edit Member</h2>
            <div className="space-y-3">
              <div>
                <label className="font-heading font-bold text-sm mb-1 block">Name</label>
                <input
                  className="brutal-input w-full rounded-md"
                  placeholder="Enter name..."
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="font-heading font-bold text-sm mb-1 block">Email</label>
                <input
                  className="brutal-input w-full rounded-md"
                  placeholder="Enter email..."
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="font-heading font-bold text-sm mb-1 block">Membership</label>
                <select
                  className="brutal-input w-full rounded-md"
                  value={editForm.membership}
                  onChange={(e) => setEditForm((f) => ({ ...f, membership: e.target.value }))}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading flex-1 flex items-center justify-center gap-2"
                  onClick={handleEditSave}
                  disabled={updateMember.isPending || !editForm.name || !editForm.email}
                >
                  {updateMember.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
                <button onClick={() => setEditMember(null)} className="brutal-btn bg-background rounded-md font-heading">Cancel</button>
              </div>
              {updateMember.isError && (
                <p className="text-destructive text-sm font-heading">Failed to update member. Try again.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MemberManagement;
