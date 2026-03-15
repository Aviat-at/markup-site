import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export function NewsletterCard() {
  return (
    <Card sx={{ background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(14,165,233,0.15))" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Typography variant="h5">Get practical articles every Friday</Typography>
          <Typography color="text.secondary">
            A concise weekly email about web engineering, product design, and modern development workflows.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField placeholder="you@company.com" fullWidth size="small" />
            <Button variant="contained">Subscribe</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
