"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { useLocaleState } from "./locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gold/10 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.brand.tagline}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="mailto:alielsadeq4@gmail.com"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted hover:bg-gold/10 hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/gold" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.gold}
                </Link>
              </li>
              <li>
                <Link href="/bars" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.bars}
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="/charts" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.charts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.terms}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.faq}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {t.footer.disclaimer.split(" ").slice(0, 3).join(" ")}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year} ELSADEQ. {t.footer.rights}.
          </p>
          <p className="flex items-center gap-1.5">
            <span>{t.footer.madeWith}</span>
            <span className="text-gold">♥</span>
            <span>EG</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
