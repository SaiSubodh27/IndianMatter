import React, { createContext, useContext, useEffect, useState } from "react";
/**
 * ThemeProvider — dark/light/system theme management, shadcn-style.
 *
 * Persists the choice under localStorage key "vite-ui-theme" and applies it by
 * toggling the "dark"/"light" class on <html>. All Tailwind dark: variants and
 * theme-aware components (Sidebar, TopHeader, cards, viewer canvases) react to
 * that root class, so they need not consume this context directly.
 * Mounted in src/main.tsx around <App />.
 */
type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

/** Generic fallback value so context consumers before mount don't crash (the
 *  no-op setTheme only fires if someone renders outside the real provider). */
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION — THEME PROVIDER (dark/light theme context)
// ══════════════════════════════════════════════════════════════════════════════

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    return (window.localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      window.localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
