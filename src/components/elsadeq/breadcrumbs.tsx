"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocaleState } from "./locale-state";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component.
 * Shows: Home > Section > Subsection
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { locale } = useLocaleState();
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground mb-4 print:hidden",
        className,
      )}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-gold transition-colors"
        aria-label="home"
      >
        <Home className="h-3 w-3" />
        <span className="sr-only">{locale === "ar" ? "الرئيسية" : "Home"}</span>
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <Arrow className="h-3 w-3 text-muted-foreground/60 rtl-flip" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold font-medium truncate max-w-[150px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
