import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ThemeRegistry from "./theme-registry";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://markup-journal.example.com"),
  title: {
    default: "Markup Journal — Full-Stack, Cloud & AI",
    template: "%s | Markup Journal",
  },
  description: "A modern technical blog focused on full-stack engineering, Cloud architecture, AI workflows, design systems, and scalable product development.",
  openGraph: {
    title: "Markup Journal — Full-Stack, Cloud & AI",
    description: "Modern editorial content for developers, founders, and product teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markup Journal — Full-Stack, Cloud & AI",
    description: "Modern editorial content for developers, founders, and product teams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <SiteHeader />
            <Container sx={{ py: { xs: 4, md: 6 } }}>{children}</Container>
            <SiteFooter />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
