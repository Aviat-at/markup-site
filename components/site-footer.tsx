import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export function SiteFooter() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: 10, py: 5 }}>
      <Container>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Markup Journal. Crafted with Next.js + MUI.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/blog">Blog</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
