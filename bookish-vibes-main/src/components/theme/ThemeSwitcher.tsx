import { useState, useRef, useEffect } from "react";
import { Palette, X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { ThemePickerGrid } from "./ThemePreviewCard";

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { currentTheme, setTheme, isTransitioning } = useThemeStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-theme-switcher"
        className="w-9 h-9 flex items-center justify-center rounded-md brutal-border hover:bg-muted transition-colors"
        title="Switch theme"
        aria-label="Open theme switcher"
      >
        <Palette className={`w-5 h-5 transition-transform ${isTransitioning ? 'animate-spin' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-[200] brutal-card rounded-lg p-3 sm:p-4 w-[min(560px,95vw)] sm:w-[min(560px,90vw)] max-h-[85vh] overflow-y-auto"
          role="dialog"
          aria-label="Theme picker"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading font-black text-sm uppercase tracking-wider">Choose Theme</p>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ThemePickerGrid
            currentTheme={currentTheme}
            onSelect={(key) => {
              setTheme(key);
              setTimeout(() => setOpen(false), 200);
            }}
            compact
          />

          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            Theme saved automatically
          </p>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
