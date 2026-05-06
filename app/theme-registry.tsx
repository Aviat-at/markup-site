"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#a855f7",
    },
    background: {
      default: "#050810",
      paper: "#0d1117",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#64748b",
    },
    divider: "rgba(255,255,255,0.07)",
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.8 },
    body2: { lineHeight: 1.7 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            borderColor: "rgba(99,102,241,0.5)",
            boxShadow: "0 0 32px rgba(99,102,241,0.2), 0 8px 32px rgba(0,0,0,0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(99,102,241,0.12)",
          borderColor: "rgba(99,102,241,0.35)",
          color: "#818cf8",
          border: "1px solid",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.07)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "background 0.2s ease, transform 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(99,102,241,0.1)",
            transform: "translateX(4px)",
          },
        },
      },
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
