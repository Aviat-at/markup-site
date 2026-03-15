import Link from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Stack spacing={2} alignItems="flex-start" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary.main" fontWeight={700}>404</Typography>
      <Typography variant="h2">Page not found</Typography>
      <Typography color="text.secondary" maxWidth={520}>
        The page you requested doesn’t exist or may have moved. Let’s get you back to the latest articles.
      </Typography>
      <Link href="/" style={{ textDecoration: "none" }}><Button variant="contained">Back to homepage</Button></Link>
    </Stack>
  );
}
