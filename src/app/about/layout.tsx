import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("about");

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
