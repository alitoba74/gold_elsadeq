import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("coins");

export default function CoinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
