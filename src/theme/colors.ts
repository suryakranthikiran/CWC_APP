export type ThemeMode = "light" | "dark";

export type AppTheme = {
  mode: ThemeMode;
  isDark: boolean;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  icon: string;
  statusBar: "light-content" | "dark-content";
  gradient: [string, string, string];
  toggleTrack: string;
  toggleThumb: string;
  shadow: string;
};

export const themes: Record<ThemeMode, AppTheme> = {
  dark: {
    mode: "dark",
    isDark: true,
    background: "#0a0a1a",
    backgroundSecondary: "#0f0f2e",
    surface: "rgba(15, 23, 42, 0.72)",
    surfaceElevated: "rgba(30, 41, 59, 0.84)",
    surfaceMuted: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.08)",
    text: "#f8fafc",
    textSecondary: "#e2e8f0",
    textMuted: "#94a3b8",
    icon: "#e2e8f0",
    statusBar: "light-content",
    gradient: ["#0a0a1a", "#0f0f2e", "#111827"],
    toggleTrack: "rgba(255,255,255,0.12)",
    toggleThumb: "#fbbf24",
    shadow: "rgba(15, 23, 42, 0.45)",
  },
  light: {
    mode: "light",
    isDark: false,
    background: "#f8fafc",
    backgroundSecondary: "#e2e8f0",
    surface: "rgba(255,255,255,0.88)",
    surfaceElevated: "rgba(255,255,255,0.96)",
    surfaceMuted: "rgba(148, 163, 184, 0.12)",
    border: "rgba(15, 23, 42, 0.12)",
    text: "#0f172a",
    textSecondary: "#1e293b",
    textMuted: "#64748b",
    icon: "#1e293b",
    statusBar: "dark-content",
    gradient: ["#f8fafc", "#e2e8f0", "#cbd5e1"],
    toggleTrack: "rgba(15,23,42,0.1)",
    toggleThumb: "#2563eb",
    shadow: "rgba(148, 163, 184, 0.32)",
  },
};