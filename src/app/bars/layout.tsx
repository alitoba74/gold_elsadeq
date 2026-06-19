import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("bars");

export default function BarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
