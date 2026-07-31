"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#a64f2b" },
    background: { default: "#f7f4ed", paper: "#fffdf8" },
    text: { primary: "#17201d", secondary: "#65706b" },
    divider: "#dcd9d0",
  },
  typography: {
    fontFamily: "var(--font-sans)",
    h1: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.04em" },
    h2: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.03em" },
    h3: { fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.025em" },
    body1: { lineHeight: 1.75 },
    body2: { lineHeight: 1.65 },
  },
  shape: { borderRadius: 4 },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
