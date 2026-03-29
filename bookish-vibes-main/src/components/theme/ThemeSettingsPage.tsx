import { motion } from "framer-motion";
import { Palette, Check, Monitor, Moon } from "lucide-react";
import { useThemeStore, THEMES, ThemeKey } from "@/store/themeStore";
import { ThemePickerGrid } from "./ThemePreviewCard";
import { toast } from "@/components/ui/sonner";

const ThemeSettingsPage = () => {
  const { currentTheme, setTheme, isTransitioning } = useThemeStore();

  const handleSelect = (key: ThemeKey) => {
    setTheme(key);
    const name = THEMES.find((t) => t.key === key)?.name ?? key;
    toast.success(`Theme switched to ${name}`);
  };

  const activeTheme = THEMES.find((t) => t.key === currentTheme)!;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary brutal-border rounded-md flex items-center justify-center">
          <Palette className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight">Appearance &amp; Style</h2>
          <p className="text-sm text-muted-foreground">Choose your visual experience — saved automatically</p>
        </div>
      </div>

      {/* Active theme summary */}
      <div
        className="brutal-card p-4 rounded-lg flex items-center gap-4"
        style={{ borderColor: activeTheme.colors.border }}
      >
        <div
          className="w-12 h-12 rounded-md flex-shrink-0 border-2"
          style={{ backgroundColor: activeTheme.colors.accent, borderColor: activeTheme.colors.border }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-heading font-black text-lg">{activeTheme.name}</p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: activeTheme.mode === 'dark' ? '#1a1a1a' : '#e0e0e0',
                color: activeTheme.mode === 'dark' ? '#fff' : '#111',
              }}
            >
              {activeTheme.mode === 'dark' ? <Moon className="inline w-3 h-3 mr-0.5" /> : <Monitor className="inline w-3 h-3 mr-0.5" />}
              {activeTheme.mode.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{activeTheme.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Font: {activeTheme.fontLabel}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
          <Check className="w-4 h-4 text-primary" />
          Active
        </div>
      </div>

      {/* Color palette dots */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Palette</p>
        <div className="flex gap-1.5">
          {Object.values(activeTheme.colors).map((color, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-foreground"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Theme grid */}
      <div>
        <p className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-muted-foreground">
          Select Theme
        </p>
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <ThemePickerGrid currentTheme={currentTheme} onSelect={handleSelect} />
        </div>
      </div>

      {/* Theme descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.key}
            onClick={() => handleSelect(theme.key)}
            data-testid={`theme-detail-${theme.key}`}
            className="brutal-card p-3 rounded-lg text-left transition-all hover:-translate-y-0.5"
            style={{
              borderColor: currentTheme === theme.key ? theme.colors.accent : undefined,
              borderWidth: currentTheme === theme.key ? 3 : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
              <p className="font-heading font-bold text-sm">{theme.name}</p>
              {currentTheme === theme.key && <Check className="w-3 h-3 ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground">{theme.description}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Font: {theme.fontLabel}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ThemeSettingsPage;
