import { PageTransitionFlip } from "./components/AnimatedComponents";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransitionFlip>{children}</PageTransitionFlip>;
}
