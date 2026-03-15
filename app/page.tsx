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

export default function HomePage() {
  const categorySummaries = getCategorySummaries();
  const latestPosts = getAllPosts().slice(0, 6);
  const tags = getTags().slice(0, 12);

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Technical notes, tutorials, and field-tested workflows.
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 850 }}>
          Welcome to a complete engineering blog powered by Markdown, Next.js, and
          Vercel. Browse by category, read the latest posts, and explore topic tags.
        </Typography>
      </Box>

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
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      {summary.category.toUpperCase()}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {summary.postCount} post{summary.postCount === 1 ? "" : "s"}
                      {summary.latestPostDate
                        ? ` • latest ${summary.latestPostDate}`
                        : " • no dates yet"}
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
                    "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                  }}
                >
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      {post.category.toUpperCase()} • {post.readingTime}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>
                      {post.title}
                    </Typography>
                    {post.description ? (
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {post.description}
                      </Typography>
                    ) : null}
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
          Popular topics
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </Stack>
      </section>
    </Stack>
  );
}
