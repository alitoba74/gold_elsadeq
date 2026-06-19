"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coins, Calculator, LineChart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useLocaleState } from "./locale-state";
import { getDict } from "@/lib/i18n/dictionaries";

const items = [
  { key: "home", href: "/", icon: Home },
  { key: "bars", href: "/bars", icon: Coins },
  { key: "calculator", href: "/calculator", icon: Calculator },
  { key: "charts", href: "/charts", icon: LineChart },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [open, setOpen] = React.useState(false);

  // Don't show on admin pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  const moreLinks = [
    { key: "gold", href: "/gold" },
    { key: "coins", href: "/coins" },
    { key: "converter", href: "/converter" },
    { key: "news", href: "/news" },
    { key: "faq", href: "/faq" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
  ] as const;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/85 backdrop-blur-xl border-t border-gold/10 safe-area-bottom"
      aria-label="bottom navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href;
          return (
            <Link
              key={it.key}
              href={it.href}
              className={
                "flex flex-col items-center justify-center gap-0.5 h-12 rounded-lg transition-colors " +
                (active ? "text-gold" : "text-muted-foreground hover:text-foreground")
              }
            >
              <Icon className={"h-5 w-5 " + (active ? "drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]" : "")} />
              <span className="text-[10px] font-medium">
                {t.nav[it.key as keyof typeof t.nav]}
              </span>
            </Link>
          );
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="flex flex-col items-center justify-center gap-0.5 h-12 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="more"
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.common.filter}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="text-center">
              <SheetTitle className="flex justify-center">
                <Logo size="sm" />
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-2 p-4">
              {moreLinks.map((l) => (
                <Link
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-center text-xs font-medium bg-muted/50 hover:bg-gold/10 hover:text-gold"
                >
                  {t.nav[l.key as keyof typeof t.nav]}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
