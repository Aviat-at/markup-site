import { PageTransition } from "./components/AnimatedComponents";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
