import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("gold");

export default function GoldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
