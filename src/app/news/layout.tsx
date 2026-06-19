import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("news");

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
