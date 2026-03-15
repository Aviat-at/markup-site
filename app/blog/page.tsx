import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import { BlogFilters } from "@/components/blog-filters";
import { SectionHeader } from "@/components/section-header";
import { getAllPosts, getCategories, getTags } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse all articles by category, tags, and search terms.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const tags = getTags();

  return (
    <Stack spacing={3}>
      <SectionHeader
        eyebrow="Blog"
        title="Browse all articles"
        subtitle="Filter by category, topic, and sort order to quickly find relevant posts."
      />
      <BlogFilters posts={posts} categories={categories} tags={tags} />
    </Stack>
  );
}
