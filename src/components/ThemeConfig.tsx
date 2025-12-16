import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type AppTheme = "default" | "ocean" | "forest" | "sunset" | "lavender" | "slate";

interface ThemeColors {
  primary: string;
  accent: string;
  gradient: string;
}

export const themeColors: Record<AppTheme, ThemeColors> = {
  default: {
    primary: "hsl(var(--primary))",
    accent: "hsl(var(--accent))",
    gradient: "from-primary to-accent",
  },
  ocean: {
    primary: "hsl(200, 90%, 50%)",
    accent: "hsl(180, 80%, 45%)",
    gradient: "from-cyan-500 to-blue-600",
  },
  forest: {
    primary: "hsl(152, 76%, 40%)",
    accent: "hsl(142, 70%, 45%)",
    gradient: "from-emerald-500 to-green-600",
  },
  sunset: {
    primary: "hsl(25, 95%, 55%)",
    accent: "hsl(350, 85%, 55%)",
    gradient: "from-orange-500 to-rose-600",
  },
  lavender: {
    primary: "hsl(262, 83%, 58%)",
    accent: "hsl(280, 75%, 60%)",
    gradient: "from-violet-500 to-purple-600",
  },
  slate: {
    primary: "hsl(220, 15%, 40%)",
    accent: "hsl(220, 25%, 50%)",
    gradient: "from-slate-500 to-slate-700",
  },
};

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem("app-theme");
    return (saved as AppTheme) || "default";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const colors = themeColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
