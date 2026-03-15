import type { Metadata } from "next";
import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ThemeRegistry from "./theme-registry";

export const metadata: Metadata = {
  title: {
    default: "Akash Tharindu Blog",
    template: "%s | Akash Tharindu Blog",
  },
  description:
    "Technical blog with practical guides on Linux, Docker, Next.js, and engineering workflows.",
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
          <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Box
              component="header"
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 10,
              }}
            >
              <Container maxWidth="lg" sx={{ py: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography variant="h6" fontWeight={700}>
                      Akash Tharindu Blog
                    </Typography>
                  </Link>

                  <Stack direction="row" spacing={1}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                      <Button size="small">Home</Button>
                    </Link>
                  </Stack>
                </Stack>
              </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
              {children}
            </Container>

            <Box
              component="footer"
              sx={{ borderTop: "1px solid", borderColor: "divider", py: 3, mt: 6 }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} Akash Tharindu. Built with Next.js + MUI,
                  deployed on Vercel.
                </Typography>
              </Container>
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
