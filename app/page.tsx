import Link from "next/link";
import { getCategories } from "@/lib/content";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { Terminal, Code, Box as BoxIcon, FileCode, Beaker, Zap, GitBranch } from "lucide-react";
import { FlipReveal, FlipCardHover } from "./components/AnimatedComponents";

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string; description: string }
> = {
  "About-me": {
    icon: <Zap size={20} />,
    color: "#6366f1",
    description: "Personal profile & background",
  },
  linux: {
    icon: <Terminal size={20} />,
    color: "#10b981",
    description: "Linux, shell & DevOps commands",
  },
  "Next.js": {
    icon: <Code size={20} />,
    color: "#06b6d4",
    description: "Next.js & React development",
  },
  python: {
    icon: <FileCode size={20} />,
    color: "#f59e0b",
    description: "Python scripts & libraries",
  },
  test: {
    icon: <Beaker size={20} />,
    color: "#ec4899",
    description: "Testing strategies & examples",
  },
  git: {
    icon: <GitBranch size={20} />,
    color: "#f97316",
    description: "Git workflows, commit conventions & version control",
  },
};

const FALLBACK_COLORS = [
  "#6366f1",
  "#10b981",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#a855f7",
];

export default function HomePage() {
  const categories = getCategories();

  return (
    <Box>
      {/* ── Hero ── */}
      <FlipReveal delay={0.1} origin="bottom">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 7, md: 12 },
            mb: { xs: 4, md: 8 },
            position: "relative",
          }}
        >
          {/* Subtle radial glow behind hero */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              letterSpacing: "0.25em",
              fontWeight: 700,
              display: "block",
              mb: 2,
              fontSize: "0.7rem",
            }}
          >
            Full-Stack Engineering
          </Typography>

          <Typography
            component="h1"
            className="gradient-text"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.8rem", sm: "3.8rem", md: "5rem" },
              lineHeight: 1.1,
              mb: 3,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            Akash Tharindu
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 3,
              fontWeight: 400,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Software Engineer&nbsp;·&nbsp;Cloud &amp; DevOps&nbsp;·&nbsp;AI Systems
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 520,
              mx: "auto",
              lineHeight: 1.85,
              fontSize: "0.95rem",
            }}
          >
            A curated knowledge base covering full-stack engineering, Linux &amp;
            DevOps, cloud infrastructure, and AI-powered systems.
          </Typography>

          <Box className="accent-bar" />
        </Box>
      </FlipReveal>

      {/* ── Category grid ── */}
      <Grid container spacing={3}>
        {categories.map((cat, idx) => {
          const meta = CATEGORY_META[cat];
          const color = meta?.color ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
          const icon = meta?.icon ?? <BoxIcon size={20} />;
          const description = meta?.description ?? `Articles in ${cat}`;
          const delay = 0.2 + idx * 0.1;

          return (
            <Grid key={`${cat}-${idx}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <FlipReveal delay={delay} origin="top">
                <Link
                  href={`/${cat}`}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <FlipCardHover>
                    <Card
                      variant="outlined"
                      sx={{ height: "100%", position: "relative", overflow: "hidden" }}
                    >
                      {/* Top accent bar */}
                      <Box
                        sx={{
                          height: "3px",
                          background: `linear-gradient(90deg, ${color}, ${color}55)`,
                        }}
                      />

                      <CardContent sx={{ p: 3 }}>
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            background: `${color}18`,
                            border: `1px solid ${color}35`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.3rem",
                            mb: 2,
                            color: color,
                          }}
                        >
                          {icon}
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 0.75, color: "text.primary" }}
                        >
                          {cat}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>

                        {/* Arrow hint */}
                        <Box
                          sx={{
                            mt: 2.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: color,
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            opacity: 0.8,
                          }}
                        >
                          Browse notes
                          <span style={{ fontSize: "0.9rem" }}>→</span>
                        </Box>
                      </CardContent>
                    </Card>
                  </FlipCardHover>
                </Link>
              </FlipReveal>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
