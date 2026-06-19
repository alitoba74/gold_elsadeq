import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("terms");

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
