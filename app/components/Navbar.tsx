import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getCategories } from "@/lib/content";

export default function Navbar() {
  const categories = getCategories();

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(5,8,16,0.80)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        py: 1.5,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}
              >
                AT
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.95rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Akash Tharindu
              </Typography>
            </Box>
          </Link>

          {/* Nav links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2.5 },
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <Link key={cat} href={`/${cat}`} style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.82rem",
                    transition: "color 0.2s ease",
                    textTransform: "capitalize",
                    "&:hover": {
                      color: "primary.light",
                    },
                  }}
                >
                  {cat}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
