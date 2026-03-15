import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PostMeta } from "@/lib/content";

type Props = {
  post: PostMeta;
  compact?: boolean;
};

export function PostCard({ post, compact = false }: Props) {
  return (
    <Link href={`/${post.category}/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card sx={{ height: "100%", '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
        <Box
          sx={{
            height: compact ? 120 : 170,
            background: post.coverImage,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            {post.category} · {post.readingTime}
          </Typography>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {post.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.2 }}>
            {post.description || "Read this article for practical steps and implementation details."}
          </Typography>
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} size="small" label={tag} />
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary" mt={2}>
            {post.author} · {post.date || "Draft"}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
