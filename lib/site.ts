import {
  Braces,
  Container,
  GitBranch,
  HardDrive,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";

export const SITE_URL = "https://blog.akashtharindu.com";

export const categoryMeta: Record<
  string,
  { label: string; description: string; icon: LucideIcon; accent: string }
> = {
  "About-me": {
    label: "About",
    description: "The story, principles, and tools behind my work.",
    icon: NotebookPen,
    accent: "#b65d35",
  },
  Docker: {
    label: "Docker",
    description: "Containers, Compose, and production delivery patterns.",
    icon: Container,
    accent: "#397aa8",
  },
  linux: {
    label: "Linux",
    description: "Practical notes on systems, shells, and infrastructure.",
    icon: HardDrive,
    accent: "#68834b",
  },
  "Next.js": {
    label: "Next.js",
    description: "Building considered web experiences with React and Next.js.",
    icon: Braces,
    accent: "#7256a3",
  },
  PostgreSQL: {
    label: "PostgreSQL",
    description: "Database internals, reliability, and operational practice.",
    icon: HardDrive,
    accent: "#3f708d",
  },
  git: {
    label: "Git",
    description: "Version control habits for maintainable software teams.",
    icon: GitBranch,
    accent: "#b3633d",
  },
};

export function getCategoryMeta(category: string) {
  return (
    categoryMeta[category] ?? {
      label: category,
      description: `Technical notes and field guides about ${category}.`,
      icon: NotebookPen,
      accent: "#b65d35",
    }
  );
}
