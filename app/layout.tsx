import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ThemeRegistry from "./theme-registry";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Akash Tharindu — Full-Stack Engineer",
  description:
    "A personal knowledge base covering full-stack engineering, Linux, DevOps, cloud infrastructure, and AI-powered systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeRegistry>
          <Navbar />
          <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="xl">{children}</Container>
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              py: 3,
              mt: 8,
              textAlign: "center",
            }}
          >
            <Container maxWidth="xl">
              <Box
                sx={{
                  color: "text.secondary",
                  fontSize: "0.78rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                © {new Date().getFullYear()} Akash Tharindu · Full-Stack Engineer
              </Box>
            </Container>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
