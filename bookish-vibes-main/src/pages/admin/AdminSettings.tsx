import AdminLayout from "@/components/layout/AdminLayout";
import ThemeSettingsPage from "@/components/theme/ThemeSettingsPage";

const AdminSettings = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-black">Settings</h1>
        <p className="text-muted-foreground">Manage your admin preferences</p>
      </div>
      <ThemeSettingsPage />
    </div>
  );
};

export default AdminSettings;
