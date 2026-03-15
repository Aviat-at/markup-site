import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {category.toUpperCase()}
        </Typography>
        <Typography color="text.secondary">
          {posts.length} article{posts.length === 1 ? "" : "s"} in this category.
        </Typography>
      </div>

      <Link href="/" style={{ textDecoration: "none", width: "fit-content" }}>
        <Button variant="text">← Back home</Button>
      </Link>

      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid key={`${post.category}-${post.slug}`} size={{ xs: 12 }}>
            <Link href={`/${post.category}/${post.slug}`} style={{ textDecoration: "none" }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  {post.description ? (
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {post.description}
                    </Typography>
                  ) : null}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {post.date || "No publish date"} • {post.readingTime}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ mt: 1.5 }}
                  >
                    {(post.tags ?? []).map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {posts.length === 0 ? (
        <Typography color="text.secondary">
          No posts found in this category yet. Add markdown files under
          <code> content/{category}</code>.
        </Typography>
      ) : null}
    </Stack>
  );
}
