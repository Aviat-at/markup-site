import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPostsByCategory, getPost } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

export function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const posts = getPostsByCategory(category);
    for (const post of posts) {
      params.push({ category, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.meta.title,
    description: post.meta.description || `Read ${post.meta.title} from ${category}.`,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Stack spacing={3}>
      <Link
        href={`/${category}`}
        style={{ textDecoration: "none", width: "fit-content" }}
      >
        <Button variant="text">← Back to {category}</Button>
      </Link>

      <Box>
        <Typography variant="overline" color="text.secondary">
          {category.toUpperCase()} • {post.meta.readingTime}
        </Typography>
        <Typography variant="h3" sx={{ mt: 1 }} gutterBottom fontWeight={700}>
          {post.meta.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {post.meta.date ? `Updated: ${post.meta.date}` : "No publish date"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {(post.meta.tags ?? []).map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Stack>

      <Divider />

      <Box
        sx={{
          fontSize: "1.05rem",
          lineHeight: 1.7,
          "& h1, & h2, & h3": { mt: 4, mb: 2 },
          "& p": { mb: 2 },
          "& pre": {
            p: 2,
            overflow: "auto",
            borderRadius: 2,
            bgcolor: "rgba(127,127,127,0.12)",
          },
          "& code": { fontFamily: "monospace" },
          "& a": { color: "primary.main" },
          "& ul, & ol": { pl: 3, mb: 2 },
        }}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </Stack>
  );
}
