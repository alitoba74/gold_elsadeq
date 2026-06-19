"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/elsadeq/logo";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import {
  LayoutDashboard,
  Coins,
  Newspaper,
  Megaphone,
  Users,
  Settings,
  ScrollText,
  SlidersHorizontal,
  Home,
} from "lucide-react";

const items = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "prices", href: "/admin/prices", icon: Coins },
  { key: "overrides", href: "/admin/overrides", icon: SlidersHorizontal },
  { key: "news", href: "/admin/news", icon: Newspaper },
  { key: "announcements", href: "/admin/announcements", icon: Megaphone },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "audit", href: "/admin/audit", icon: ScrollText },
  { key: "settings", href: "/admin/settings", icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [authed, setAuthed] = React.useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data?.is_admin) {
            router.push("/");
            return;
          }
          setIsAdmin(true);
          setAuthed(true);
        });
    });
  }, [supabase, router]);

  if (!authed || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold">
            {t.admin.title}
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"
        >
          <Home className="h-3 w-3" />
          {t.nav.home}
        </Link>
      </header>

      <div className="grid lg:grid-cols-[200px_1fr] gap-4">
        {/* Sidebar */}
        <nav className="hidden lg:block space-y-1 sticky top-20 self-start">
          {items.map((it) => {
            const Icon = it.icon;
            const active = pathname === it.href;
            return (
              <Link
                key={it.key}
                href={it.href}
                className={
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-gold/10 text-gold"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground")
                }
              >
                <Icon className="h-4 w-4" />
                {t.admin[it.key as keyof typeof t.admin]}
              </Link>
            );
          })}
        </nav>

        {/* Mobile top scroll nav */}
        <div className="lg:hidden col-span-full -mx-3 px-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2">
            {items.map((it) => {
              const Icon = it.icon;
              const active = pathname === it.href;
              return (
                <Link
                  key={it.key}
                  href={it.href}
                  className={
                    "flex-shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium " +
                    (active
                      ? "bg-gold/10 text-gold"
                      : "bg-muted text-foreground/70")
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.admin[it.key as keyof typeof t.admin]}
                </Link>
              );
            })}
          </div>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
