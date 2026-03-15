import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} posts`,
    description: `Explore ${category} articles on Markup Journal.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="overline" color="primary.main" fontWeight={700}>
          Category archive
        </Typography>
        <Typography variant="h2">{category}</Typography>
        <Typography color="text.secondary">
          {posts.length} article{posts.length === 1 ? "" : "s"} in this collection.
        </Typography>
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <Button variant="text" sx={{ width: "fit-content", px: 0 }}>← Back to blog index</Button>
        </Link>
      </Stack>

      <Grid container spacing={2.5}>
        {posts.map((post) => (
          <Grid key={post.slug} size={{ xs: 12, md: 6 }}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>

      {!posts.length ? <Typography color="text.secondary">No posts yet in this category.</Typography> : null}
    </Stack>
  );
}
