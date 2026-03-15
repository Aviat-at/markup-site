import Link from "next/link";
import { getAllPosts, getCategorySummaries, getTags } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

export default function HomePage() {
  const categorySummaries = getCategorySummaries();
  const latestPosts = getAllPosts().slice(0, 6);
  const tags = getTags().slice(0, 14);
  const firstCategory = categorySummaries[0]?.category;

  return (
    <Stack spacing={5}>
      <Card
        sx={{
          background: "linear-gradient(135deg, #ffffff 10%, #eef3ff 100%)",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={2}>
            <Typography variant="h3">A clean, practical, and modern technical blog.</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 820 }}>
              Learn through concise real-world tutorials on Linux, Docker, Next.js, and
              developer tooling. Everything is written in Markdown and deployed on Vercel.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Link href={firstCategory ? `/${firstCategory}` : "/"} style={{ textDecoration: "none" }}>
                <Button variant="contained">Start reading</Button>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Browse latest posts</Button>
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <section>
        <Typography variant="h5" gutterBottom>
          Browse categories
        </Typography>
        <Grid container spacing={2}>
          {categorySummaries.map((summary) => (
            <Grid key={summary.category} size={{ xs: 12, md: 6 }}>
              <Link href={`/${summary.category}`} style={{ textDecoration: "none" }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{summary.category.toUpperCase()}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {summary.postCount} post{summary.postCount === 1 ? "" : "s"}
                      {summary.latestPostDate ? ` • updated ${summary.latestPostDate}` : ""}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </section>

      <Divider />

      <section>
        <Typography variant="h5" gutterBottom>
          Latest posts
        </Typography>
        <Grid container spacing={2}>
          {latestPosts.map((post) => (
            <Grid key={`${post.category}-${post.slug}`} size={{ xs: 12, md: 6 }}>
              <Link href={`/${post.category}/${post.slug}`} style={{ textDecoration: "none" }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      {post.category.toUpperCase()} • {post.readingTime}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>
                      {post.title}
                    </Typography>
                    {!!post.description && (
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {post.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {post.date || "No publish date"}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </section>

      <section>
        <Typography variant="h5" gutterBottom>
          Topics
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </Box>
      </section>
    </Stack>
  );
}
