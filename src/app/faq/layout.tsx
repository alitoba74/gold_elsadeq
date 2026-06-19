import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("faq");

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
