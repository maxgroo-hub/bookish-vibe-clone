import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store";
import ThemeSettingsPage from "@/components/theme/ThemeSettingsPage";

const Profile = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="font-heading text-3xl font-black">My Profile</h1>

      {/* Membership Card */}
      <motion.div
        className="brutal-card bg-foreground text-background p-6 rounded-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full -translate-y-8 translate-x-8 opacity-30" />
        <p className="text-xs font-bold opacity-60 mb-1">LIBRAVAULT MEMBERSHIP</p>
        <h2 className="font-heading text-2xl font-black">{user?.fullName}</h2>
        <p className="text-sm opacity-80">{user?.email}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-heading font-bold rounded brutal-border">
            {user?.membershipType?.toUpperCase()}
          </span>
          <span className="text-xs opacity-60">Expires: Dec 2026</span>
        </div>
      </motion.div>

      {/* Edit Form */}
      <div className="brutal-card p-6 rounded-lg space-y-4">
        <h2 className="font-heading text-xl font-bold">Edit Profile</h2>

        <div>
          <label className="font-heading font-bold text-sm mb-1 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input defaultValue={user?.fullName} className="brutal-input w-full pl-11 rounded-md" />
          </div>
        </div>

        <div>
          <label className="font-heading font-bold text-sm mb-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input defaultValue={user?.email} className="brutal-input w-full pl-11 rounded-md" disabled />
          </div>
        </div>

        <div>
          <label className="font-heading font-bold text-sm mb-1 block">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input placeholder="+1 (555) 123-4567" className="brutal-input w-full pl-11 rounded-md" />
          </div>
        </div>

        <div>
          <label className="font-heading font-bold text-sm mb-1 block">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input placeholder="123 Library Lane" className="brutal-input w-full pl-11 rounded-md" />
          </div>
        </div>

        <button className="brutal-btn bg-primary text-primary-foreground rounded-md font-heading">
          Save Changes
        </button>
      </div>

      {/* Appearance */}
      <div className="brutal-card p-6 rounded-lg">
        <ThemeSettingsPage />
      </div>

      {/* Danger Zone */}
      <div className="brutal-card border-destructive p-6 rounded-lg">
        <h2 className="font-heading text-xl font-bold text-destructive mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
        <button className="brutal-btn bg-destructive text-destructive-foreground rounded-md font-heading text-sm flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
