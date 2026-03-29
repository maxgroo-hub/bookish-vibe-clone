import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeKey =
  | 'neo-brutalist'
  | 'vaporwave-dreams'
  | 'pastel-riot';

export interface ThemeConfig {
  key: ThemeKey;
  name: string;
  mode: 'light' | 'dark';
  description: string;
  colors: {
    bg: string;
    accent: string;
    sidebar: string;
    text: string;
    border: string;
    accent2: string;
    accent3: string;
  };
  fontLabel: string;
}

export const THEMES: ThemeConfig[] = [
  {
    key: 'neo-brutalist',
    name: 'Neo Brutalist',
    mode: 'light',
    description: 'Raw, bold, electric — the core identity',
    colors: { bg: '#FFFFFF', accent: '#FFE500', sidebar: '#0A0A0A', text: '#0A0A0A', border: '#0A0A0A', accent2: '#FF4D4D', accent3: '#0066FF' },
    fontLabel: 'Space Grotesk',
  },

  {
    key: 'vaporwave-dreams',
    name: 'Vaporwave Dreams',
    mode: 'dark',
    description: 'Retro 80s synthwave, neon nostalgia',
    colors: { bg: '#1A0533', accent: '#F72585', sidebar: '#0F0320', text: '#FFFFFF', border: '#9B5DE5', accent2: '#9B5DE5', accent3: '#00F5FF' },
    fontLabel: 'Orbitron',
  },
  {
    key: 'pastel-riot',
    name: 'Pastel Riot',
    mode: 'light',
    description: 'Kawaii brutalism, soft chaos',
    colors: { bg: '#FFF5F7', accent: '#FFB3C6', sidebar: '#FFB3C6', text: '#2D0A1F', border: '#2D0A1F', accent2: '#C8B6FF', accent3: '#B8F0D0' },
    fontLabel: 'Nunito',
  },
];

const THEME_FONTS: Record<ThemeKey, string> = {
  'neo-brutalist': 'Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600;700',

  'vaporwave-dreams': 'Orbitron:wght@400;600;700;900&family=Inter:wght@400;500;600',
  'pastel-riot': 'Nunito:wght@400;600;700;800;900',
};

function applyThemeToDOM(theme: ThemeKey) {
  document.body.className = document.body.className
    .split(' ')
    .filter((c) => !c.startsWith('theme-'))
    .join(' ')
    .trim();
  document.body.classList.add(`theme-${theme}`);

  const existing = document.getElementById('theme-font');
  if (existing) existing.remove();
  const link = document.createElement('link');
  link.id = 'theme-font';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${THEME_FONTS[theme]}&display=swap`;
  document.head.appendChild(link);
}

interface ThemeStore {
  currentTheme: ThemeKey;
  isTransitioning: boolean;
  setTheme: (theme: ThemeKey) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'neo-brutalist',
      isTransitioning: false,
      setTheme: (theme) => {
        set({ isTransitioning: true });
        applyThemeToDOM(theme);
        set({ currentTheme: theme });
        setTimeout(() => set({ isTransitioning: false }), 350);
      },
      initTheme: () => {
        let { currentTheme } = get();
        const validKeys = THEMES.map((t) => t.key);
        if (!validKeys.includes(currentTheme)) {
          currentTheme = 'neo-brutalist';
          set({ currentTheme });
        }
        document.body.classList.add('theme-initializing');
        applyThemeToDOM(currentTheme);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.body.classList.remove('theme-initializing');
          });
        });
      },
    }),
    {
      name: 'lms-theme',
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
);
