import Link from "next/link";
import { getCategories, getPostsByCategory, getPost } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { FlipReveal } from "../../components/AnimatedComponents";

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
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Post not found.
        </Typography>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            sx={{ color: "primary.main", mt: 2, display: "block" }}
          >
            ← Back home
          </Typography>
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 760, mx: "auto" }}>
      {/* Breadcrumb */}
      <FlipReveal delay={0} origin="left">
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 5 }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.light" },
                transition: "color 0.2s",
              }}
            >
              Home
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Link href={`/${category}`} style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.light" },
                transition: "color 0.2s",
              }}
            >
              {category}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            /
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "primary.light", fontWeight: 500 }}
            noWrap
          >
            {post.meta.title}
          </Typography>
        </Box>
      </FlipReveal>

      {/* Title block */}
      <FlipReveal delay={0.1} origin="bottom">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 1.5, lineHeight: 1.2 }}
          >
            {post.meta.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {post.meta.date && (
              <Typography variant="caption" color="text.secondary">
                Updated {post.meta.date}
              </Typography>
            )}

            {(post.meta.tags ?? []).length > 0 && (
              <Stack direction="row" spacing={0.75} flexWrap="wrap">
                {(post.meta.tags ?? []).map((t) => (
                  <Chip key={t} label={t} size="small" />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </FlipReveal>

      <Divider sx={{ mb: 5 }} />

      {/* Markdown content */}
      <FlipReveal delay={0.2} origin="bottom">
        <Box
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </FlipReveal>

      <Divider sx={{ mt: 8, mb: 4 }} />

      {/* Back link */}
      <FlipReveal delay={0.3} origin="left">
        <Link href={`/${category}`} style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": { color: "primary.light" },
              transition: "color 0.2s",
              fontWeight: 500,
            }}
          >
            ← Back to {category}
          </Typography>
        </Link>
      </FlipReveal>
    </Box>
  );
}
