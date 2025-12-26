import Link from "next/link";
import { getCategories, getPostsByCategory, getPost } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; slug: string }[] = [];

  for (const c of categories) {
    const posts = getPostsByCategory(c);
    for (const p of posts) params.push({ category: c, slug: p.slug });
  }
  return params;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params; // ✅ unwrap promise
  const post = await getPost(category, slug);

  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Box>
      <Link href={`/${category}`}>← Back to {category}</Link>

      <Typography variant="h3" sx={{ mt: 2 }} gutterBottom>
        {post.meta.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {post.meta.date ? `Updated: ${post.meta.date}` : ""}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: "wrap" }}>
        {(post.meta.tags ?? []).map((t) => (
          <Chip key={t} label={t} size="small" />
        ))}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          "& h1, & h2, & h3": { mt: 3 },
          "& pre": {
            p: 2,
            overflow: "auto",
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.06)",
          },
          "& code": { fontFamily: "monospace" },
          "& a": { color: "primary.main" },
        }}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </Box>
  );
}
