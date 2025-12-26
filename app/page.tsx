import Link from "next/link";
import { getCategories } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function HomePage() {
  const categories = getCategories();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Akash Tharindu Notes
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
      A personal knowledge base for Linux, Docker, and Python.
      </Typography>

      <Grid container spacing={1}>
        {categories.map((cat, idx) => (
          <Grid key={`${cat}-${idx}`} size={{ xs: 12, sm: 6, md: 3 }}>
            <Link href={`/${cat}`} style={{ textDecoration: "none" }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {cat.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Articles in {cat}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
