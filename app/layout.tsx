import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ThemeRegistry from "./theme-registry";

export const metadata: Metadata = {
  title: "Akash Tharindu Notes",
  description: "Linux, Docker, Python notes by Akash",
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
          <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">{children}</Container>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
