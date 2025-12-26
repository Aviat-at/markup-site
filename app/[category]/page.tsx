import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/content";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params; // ✅ unwrap params
  const posts = getPostsByCategory(category);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {category.toUpperCase()}
      </Typography>

      <Link href="/">← Back home</Link>

      <List sx={{ mt: 2 }}>
        {posts.map((p) => (
          <Link
            key={`${p.category}-${p.slug}`} // ✅ more stable than only slug
            href={`/${p.category}/${p.slug}`}
            style={{ textDecoration: "none" }}
          >
            <ListItemButton>
              <ListItemText
                primary={p.title}
                secondary={p.date ? `Updated: ${p.date}` : undefined}
              />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}
