import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Link from "next/link";
import { getAllPosts, getCategorySummaries, getFeaturedPosts, getTags } from "@/lib/content";
import { FeaturedPostCard } from "@/components/featured-post-card";
import { PostCard } from "@/components/post-card";
import { SectionHeader } from "@/components/section-header";
import { NewsletterCard } from "@/components/newsletter-card";

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPost = getFeaturedPosts(1)[0];
  const latestPosts = posts.slice(0, 6);
  const trendingPosts = [...posts].sort((a, b) => b.tags.length - a.tags.length).slice(0, 3);
  const categories = getCategorySummaries();
  const tags = getTags().slice(0, 14);

  return (
    <Stack spacing={7}>
      <Stack spacing={2.5}>
        <Typography variant="overline" color="primary.main" fontWeight={700}>
          Modern engineering blog platform
        </Typography>
        <Typography variant="h1" sx={{ maxWidth: 950 }}>
          Insights on frontend engineering, product design, and scalable web experiences.
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760 }}>
          Markup Journal publishes practical tutorials and strategic thinking for teams building modern digital products.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="large">Explore articles</Button>
          </Link>
          <Link href="/about" style={{ textDecoration: "none" }}>
            <Button variant="outlined" size="large">Learn about us</Button>
          </Link>
        </Stack>
      </Stack>

      {featuredPost ? <FeaturedPostCard post={featuredPost} /> : null}

      <Box component="section">
        <SectionHeader
          eyebrow="Latest"
          title="Fresh from the blog"
          subtitle="Deep dives, practical walkthroughs, and design-forward engineering advice."
        />
        <Grid container spacing={2.5}>
          {latestPosts.map((post) => (
            <Grid key={`${post.category}-${post.slug}`} size={{ xs: 12, md: 6, lg: 4 }}>
              <PostCard post={post} compact />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section">
        <SectionHeader eyebrow="Trending" title="Most discussed topics" />
        <Grid container spacing={2.5}>
          {trendingPosts.map((post) => (
            <Grid key={`${post.category}-${post.slug}`} size={{ xs: 12, md: 4 }}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section">
        <SectionHeader eyebrow="Categories" title="Discover by category" />
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid key={category.category} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Link href={`/${category.category}`} style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <span>{category.category}</span>
                  <Typography variant="body2" color="text.secondary">
                    {category.postCount}
                  </Typography>
                </Button>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section">
        <SectionHeader eyebrow="Popular tags" title="Explore quick topics" />
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} style={{ textDecoration: "none" }}>
              <Chip label={`# ${tag}`} clickable />
            </Link>
          ))}
        </Stack>
      </Box>

      <NewsletterCard />
    </Stack>
  );
}
