import type { Metadata } from "next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "About",
  description: "Learn the story and mission behind Markup Journal.",
};

export default function AboutPage() {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="overline" color="primary.main" fontWeight={700}>About us</Typography>
        <Typography variant="h2">Building a better developer publication</Typography>
        <Typography color="text.secondary" mt={1.5} maxWidth={760}>
          Markup Journal started as a personal notebook and evolved into a modern editorial platform focused on practical engineering, design systems, and product-minded frontend development.
        </Typography>
      </div>

      <Grid container spacing={2.5}>
        {[
          ["Mission", "Publish deeply useful content that helps teams ship cleaner UI and scalable frontend architecture."],
          ["Story", "We learned that teams need concise guides that blend code quality with design clarity and user outcomes."],
          ["Values", "Clarity over hype, quality over quantity, and consistency over trend-chasing."]
        ].map(([title, desc]) => (
          <Grid key={title} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography color="text.secondary" mt={1.2}>{desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
