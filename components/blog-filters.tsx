"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PostMeta } from "@/lib/content";
import { PostCard } from "@/components/post-card";

type Props = {
  posts: PostMeta[];
  categories: string[];
  tags: string[];
};

const PAGE_SIZE = 6;

export function BlogFilters({ posts, categories, tags }: Props) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [tag, setTag] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = posts.filter((post) => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.some((item) => item.toLowerCase().includes(q));
      const matchesCategory = category === "all" || post.category === category;
      const matchesTag = tag === "all" || post.tags.includes(tag);
      return matchesQuery && matchesCategory && matchesTag;
    });

    return result.sort((a, b) => {
      if (sort === "readTime") return a.readingTime.localeCompare(b.readingTime);
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.date.localeCompare(a.date);
    });
  }, [posts, query, category, tag, sort]);

  const visiblePosts = filtered.slice(0, visibleCount);

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Search posts"
            placeholder="React performance, MUI design..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
          <TextField select fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
          <TextField select fullWidth label="Tag" value={tag} onChange={(e) => setTag(e.target.value)}>
            <MenuItem value="all">All tags</MenuItem>
            {tags.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <TextField select fullWidth label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="title">Title (A-Z)</MenuItem>
            <MenuItem value="readTime">Quick reads first</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {visiblePosts.length ? (
        <Grid container spacing={2.5}>
          {visiblePosts.map((post) => (
            <Grid key={`${post.category}-${post.slug}`} size={{ xs: 12, md: 6, lg: 4 }}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">No posts match your filters. Try broadening your search.</Typography>
      )}

      {visibleCount < filtered.length ? (
        <Stack alignItems="center" pt={1}>
          <Button variant="outlined" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
            Load more posts
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
