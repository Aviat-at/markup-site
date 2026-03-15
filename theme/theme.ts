import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

export function getTheme(mode: ThemeMode) {
  const isDark = mode === "dark";

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#4f46e5",
      },
      secondary: {
        main: "#0ea5e9",
      },
      background: {
        default: isDark ? "#0b1020" : "#f6f8fc",
        paper: isDark ? "#121a2d" : "#ffffff",
      },
      text: {
        primary: isDark ? "#eef2ff" : "#0f172a",
        secondary: isDark ? "#b6c2dc" : "#475569",
      },
      divider: isDark ? alpha("#94a3b8", 0.22) : "#e2e8f0",
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily:
        "Inter, Manrope, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      h1: { fontWeight: 800, letterSpacing: "-0.03em" },
      h2: { fontWeight: 800, letterSpacing: "-0.025em" },
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.015em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: "lg",
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? alpha("#94a3b8", 0.22) : "#e2e8f0"}`,
            boxShadow: isDark
              ? "0 10px 30px rgba(0,0,0,0.3)"
              : "0 10px 30px rgba(15, 23, 42, 0.06)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 18,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
}
