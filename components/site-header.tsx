"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "@/app/theme-registry";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const { mode, toggleMode } = React.useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 72 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" fontWeight={800}>
              Markup Journal
            </Typography>
          </Link>

          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
              {links.map((link) => (
                <Button key={link.href} component={Link} href={link.href} color="inherit">
                  {link.label}
                </Button>
              ))}
            </Stack>

            <Button onClick={toggleMode} color="inherit" size="small" variant="text">
              {mode === "dark" ? "Light" : "Dark"}
            </Button>

            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, p: 2, bgcolor: theme.palette.background.default, height: "100%" }}>
          <Typography variant="h6" mb={2}>
            Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {links.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{ justifyContent: "flex-start" }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
