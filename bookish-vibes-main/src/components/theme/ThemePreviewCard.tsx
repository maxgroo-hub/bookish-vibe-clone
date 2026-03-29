import { Check } from "lucide-react";
import { THEMES, ThemeKey, ThemeConfig } from "@/store/themeStore";

interface ThemePreviewCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onSelect: (key: ThemeKey) => void;
  compact?: boolean;
}

const MiniPreview = ({ theme, compact }: { theme: ThemeConfig; compact?: boolean }) => {
  const { colors, mode } = theme;
  const h = compact ? 60 : 120;

  return (
    <div
      className="relative overflow-hidden rounded-sm border-2"
      style={{
        height: h,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      {/* Sidebar strip */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: compact ? 16 : 28, backgroundColor: colors.sidebar }}
      />

      {/* Navbar bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: compact ? 10 : 18, marginLeft: compact ? 16 : 28, backgroundColor: colors.accent, opacity: 0.9 }}
      />

      {/* Content area - mini stat cards */}
      <div
        className="absolute"
        style={{
          top: compact ? 14 : 24,
          left: compact ? 20 : 36,
          right: 4,
          bottom: 4,
          display: 'flex',
          gap: compact ? 3 : 6,
        }}
      >
        {[colors.accent, colors.accent2, colors.accent3].map((color, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ backgroundColor: color, opacity: 0.85, border: `1px solid ${colors.border}` }}
          />
        ))}
      </div>

      {/* Dark mode overlay hint */}
      {mode === 'dark' && !compact && (
        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white opacity-40" />
      )}
    </div>
  );
};

export const ThemePreviewCard = ({ theme, isActive, onSelect, compact = false }: ThemePreviewCardProps) => {
  return (
    <button
      onClick={() => onSelect(theme.key)}
      data-testid={`theme-card-${theme.key}`}
      className="relative flex flex-col gap-2 p-2 rounded-md transition-all focus:outline-none focus-visible:ring-2"
      style={{
        border: isActive ? `3px solid ${theme.colors.accent}` : `2px solid ${theme.colors.border}`,
        background: isActive ? `${theme.colors.bg}` : 'transparent',
        boxShadow: isActive ? `3px 3px 0px ${theme.colors.border}` : 'none',
        transform: isActive ? 'translate(-1px, -1px)' : 'none',
        minWidth: compact ? 100 : undefined,
      }}
      title={theme.name}
    >
      <MiniPreview theme={theme} compact={compact} />

      {!compact && (
        <div className="px-1 text-left">
          <p className="font-heading font-bold text-sm text-foreground leading-tight">{theme.name}</p>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: theme.mode === 'dark' ? '#1a1a1a' : '#f0f0f0',
              color: theme.mode === 'dark' ? '#ffffff' : '#111111',
            }}
          >
            {theme.mode.toUpperCase()}
          </span>
        </div>
      )}

      {compact && (
        <p className="text-[10px] font-bold text-foreground text-center leading-tight px-0.5 truncate">
          {theme.name}
        </p>
      )}

      {isActive && (
        <div
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.colors.accent }}
        >
          <Check className="w-3 h-3" style={{ color: theme.colors.text === '#FFFFFF' ? '#000' : theme.colors.text }} />
        </div>
      )}
    </button>
  );
};

interface ThemePickerGridProps {
  currentTheme: ThemeKey;
  onSelect: (key: ThemeKey) => void;
  compact?: boolean;
}

export const ThemePickerGrid = ({ currentTheme, onSelect, compact = false }: ThemePickerGridProps) => {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
      {THEMES.map((theme) => (
        <ThemePreviewCard
          key={theme.key}
          theme={theme}
          isActive={currentTheme === theme.key}
          onSelect={onSelect}
          compact={compact}
        />
      ))}
    </div>
  );
};
