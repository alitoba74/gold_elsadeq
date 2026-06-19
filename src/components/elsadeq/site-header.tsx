"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Settings as SettingsIcon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { CurrencyToggle } from "./currency-toggle";
import { useLocaleState, useCurrencyState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { key: "home", href: "/" },
  { key: "gold", href: "/gold" },
  { key: "bars", href: "/bars" },
  { key: "coins", href: "/coins" },
  { key: "calculator", href: "/calculator" },
  { key: "converter", href: "/converter" },
  { key: "charts", href: "/charts" },
  { key: "news", href: "/news" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "alerts", href: "/alerts" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<SupaUser | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { locale } = useLocaleState();
  const { currency } = useCurrencyState();
  const t = getDict(locale);
  const supabase = createClient();
  const { toast } = useToast();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .maybeSingle()
          .then(({ data }) => setIsAdmin(!!data?.is_admin));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => setIsAdmin(!!data?.is_admin));
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    toast({ title: t.auth.signOut, description: "" });
  };

  // Get user initials
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "";

  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-all duration-300 " +
        (scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-gold/10 shadow-sm"
          : "bg-background/40 backdrop-blur-md border-b border-transparent")
      }
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Right: Logo + mobile menu */}
          <div className="flex items-center gap-1">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9"
                  aria-label="menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                <SheetHeader className="px-5 py-4 border-b border-gold/10">
                  <SheetTitle className="flex items-center justify-between">
                    <Logo size="sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                <nav className="px-3 py-4 space-y-1 overflow-y-auto">
                  {navLinks.map((l) => (
                    <Link
                      key={l.key}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                        (pathname === l.href
                          ? "bg-gold/10 text-gold"
                          : "hover:bg-muted text-foreground/80 hover:text-foreground")
                      }
                    >
                      {t.nav[l.key as keyof typeof t.nav]}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <div className="h-px bg-gold/10 my-2" />
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gold hover:bg-gold/10"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t.nav.admin}
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center" aria-label="ELSADEQ home">
              <Logo size="md" />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(0, 8).map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                  (pathname === l.href
                    ? "text-gold bg-gold/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/60")
                }
              >
                {t.nav[l.key as keyof typeof t.nav]}
              </Link>
            ))}
          </nav>

          {/* Left: Actions */}
          <div className="flex items-center gap-1">
            <CurrencyToggle value={currency} />
            <LanguageToggle locale={locale} />
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8 border border-gold/20">
                      <AvatarFallback className="bg-gold/10 text-gold text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      {t.nav.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer">
                      <Heart className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      {t.nav.gold}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-gold">
                        <LayoutDashboard className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        {t.nav.admin}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                    {t.auth.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex bg-gold-gradient text-black hover:opacity-90"
              >
                <Link href="/auth/login">{t.nav.login}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
