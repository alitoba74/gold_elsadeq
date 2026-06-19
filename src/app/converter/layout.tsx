import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export const metadata: Metadata = buildPageMetadata("converter");

export default function ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
