import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PostMeta } from "@/lib/content";

export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <Card sx={{ overflow: "hidden" }}>
      <Box sx={{ p: { xs: 3, md: 4 }, background: post.coverImage, color: "common.white" }}>
        <Typography variant="overline" sx={{ opacity: 0.9 }}>
          Featured · {post.category}
        </Typography>
        <Typography variant="h3" mt={1}>
          {post.title}
        </Typography>
        <Typography mt={1.5} sx={{ opacity: 0.95, maxWidth: 700 }}>
          {post.description}
        </Typography>
        <Stack direction="row" spacing={1} mt={3}>
          <Link href={`/${post.category}/${post.slug}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">Read article</Button>
          </Link>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}>Explore all posts</Button>
          </Link>
        </Stack>
      </Box>
      <CardContent>
        <Typography color="text.secondary">{post.author} · {post.date || "Recently updated"} · {post.readingTime}</Typography>
      </CardContent>
    </Card>
  );
}
