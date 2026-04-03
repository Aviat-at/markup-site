import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <Box>
      {/* Back link */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <Typography
          variant="body2"
          className="animate-fade-in"
          sx={{
            color: "text.secondary",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mb: 4,
            "&:hover": { color: "primary.light" },
            transition: "color 0.2s",
            fontWeight: 500,
          }}
        >
          ← Home
        </Typography>
      </Link>

      {/* Header */}
      <Box className="animate-fade-in-up" sx={{ mb: 6 }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            letterSpacing: "0.2em",
            fontWeight: 700,
            fontSize: "0.68rem",
          }}
        >
          Knowledge Base
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, mt: 0.5, mb: 1.5 }}
        >
          {category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </Typography>
        <Box className="accent-bar" sx={{ mx: 0, mt: 2 }} />
      </Box>

      {/* Post list */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          maxWidth: 760,
        }}
      >
        {posts.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
            No articles yet.
          </Typography>
        )}

        {posts.map((p, idx) => {
          const staggerClass = `stagger-${Math.min(idx + 1, 8)}`;
          return (
            <Link
              key={`${p.category}-${p.slug}`}
              href={`/${p.category}/${p.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                className={`animate-fade-in-up ${staggerClass}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2.5,
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "rgba(99,102,241,0.45)",
                    backgroundColor: "rgba(99,102,241,0.06)",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}
                    noWrap
                  >
                    {p.title}
                  </Typography>
                  {p.date && (
                    <Typography variant="caption" color="text.secondary">
                      Updated {p.date}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                  {(p.tags ?? []).slice(0, 2).map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                  <Typography sx={{ color: "primary.main", fontSize: "1rem" }}>→</Typography>
                </Box>
              </Box>
            </Link>
          );
        })}
      </Box>

      <Divider sx={{ mt: 8, mb: 3 }} />
    </Box>
  );
}
