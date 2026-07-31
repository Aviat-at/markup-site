import { getCategories } from "@/lib/content";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return <NavbarClient categories={getCategories().filter(category => category !== "About-me")} />;
}
