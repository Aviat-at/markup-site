import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getPostsByTag, getTags } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export function generateStaticParams() {
  return getTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Tag: ${tag}`,
    description: `Articles tagged with ${tag}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(decodeURIComponent(tag));

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="overline" color="primary.main" fontWeight={700}>Tag archive</Typography>
        <Typography variant="h2">#{tag}</Typography>
        <Typography color="text.secondary">{posts.length} post(s) found.</Typography>
      </div>

      <Grid container spacing={2.5}>
        {posts.map((post) => (
          <Grid key={post.slug} size={{ xs: 12, md: 6, lg: 4 }}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
