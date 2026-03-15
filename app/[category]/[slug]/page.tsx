import type { Metadata } from "next";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getCategories, getPost, getPostsByCategory, getRelatedPosts } from "@/lib/content";
import { NewsletterCard } from "@/components/newsletter-card";
import { PostCard } from "@/components/post-card";

function getHeadings(contentHtml: string) {
  const matches = [...contentHtml.matchAll(/<h([1-3])>(.*?)<\/h\1>/g)];
  return matches.map((match, index) => ({
    id: `section-${index}`,
    level: Number(match[1]),
    text: match[2].replace(/<[^>]*>/g, ""),
  }));
}

function injectHeadingAnchors(contentHtml: string) {
  let i = 0;
  return contentHtml.replace(/<h([1-3])>(.*?)<\/h\1>/g, (_m, level, text) => {
    const id = `section-${i++}`;
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

export function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];
  for (const category of getCategories()) {
    for (const post of getPostsByCategory(category)) {
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

  return post
    ? {
        title: post.meta.title,
        description: post.meta.description,
        openGraph: {
          title: post.meta.title,
          description: post.meta.description,
          type: "article",
        },
      }
    : { title: "Post not found" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    return <Typography>Post not found.</Typography>;
  }

  const headings = getHeadings(post.contentHtml);
  const contentHtml = injectHeadingAnchors(post.contentHtml);
  const relatedPosts = getRelatedPosts(post.meta);

  return (
    <Stack spacing={4}>
      <Link href={`/${category}`} style={{ textDecoration: "none" }}>
        <Button variant="text" sx={{ width: "fit-content", px: 0 }}>← Back to {category}</Button>
      </Link>

      <Card sx={{ overflow: "hidden" }}>
        <Box sx={{ p: { xs: 3, md: 4 }, background: post.meta.coverImage, color: "common.white" }}>
          <Typography variant="overline" sx={{ opacity: 0.92 }}>
            {post.meta.category} · {post.meta.readingTime}
          </Typography>
          <Typography variant="h2" mt={1}>{post.meta.title}</Typography>
          <Typography mt={1.5} sx={{ opacity: 0.95 }}>
            {post.meta.description || post.meta.subtitle}
          </Typography>
          <Typography variant="body2" mt={2}>{post.meta.author} · {post.meta.date || "Recently"}</Typography>
          <Stack direction="row" spacing={1} mt={2} useFlexGap flexWrap="wrap">
            {post.meta.tags.map((tag) => <Chip key={tag} label={tag} color="secondary" />)}
          </Stack>
        </Box>
      </Card>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box
            sx={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              "& h1, & h2, & h3": { mt: 4.5, mb: 2, scrollMarginTop: 100 },
              "& p": { mb: 2.2, color: "text.primary" },
              "& pre": { p: 2, borderRadius: 3, overflow: "auto", bgcolor: "action.hover" },
              "& code": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
              "& blockquote": { borderLeft: "4px solid", borderColor: "primary.main", pl: 2, mx: 0, color: "text.secondary" },
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          <Divider sx={{ my: 4 }} />
          <Card>
            <CardContent>
              <Typography variant="h6">About the author</Typography>
              <Typography color="text.secondary" mt={1}>
                {post.meta.author} writes practical guides on frontend architecture, design systems, and modern product engineering.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={1.5}>Table of contents</Typography>
                <Stack spacing={1}>
                  {headings.map((heading) => (
                    <Link key={heading.id} href={`#${heading.id}`} style={{ paddingLeft: `${(heading.level - 1) * 10}px` }}>
                      {heading.text}
                    </Link>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={1.5}>Share</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="Twitter" clickable />
                  <Chip label="LinkedIn" clickable />
                  <Chip label="Copy link" clickable />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <NewsletterCard />


      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>Comments</Typography>
          <Typography color="text.secondary">
            Community comments are coming soon. For now, share feedback via LinkedIn or send your thoughts through the contact page.
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h4">Related posts</Typography>
        <Grid container spacing={2.5}>
          {relatedPosts.map((related) => (
            <Grid key={related.slug} size={{ xs: 12, md: 4 }}>
              <PostCard post={related} compact />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
