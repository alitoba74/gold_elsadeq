import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("charts");

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
