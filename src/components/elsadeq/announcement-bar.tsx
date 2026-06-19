"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Megaphone, X } from "lucide-react";
import Link from "next/link";
import { useLocaleState } from "./locale-state";
import { getDict } from "@/lib/i18n/dictionaries";

interface Announcement {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  body_ar: string | null;
  body_en: string | null;
  cta_ar: string | null;
  cta_en: string | null;
  cta_url: string | null;
  bg_color: string | null;
}

const DISMISS_KEY = "elsadeq.announcement.dismissed";

export function AnnouncementBar() {
  const supabase = createClient();
  const [ann, setAnn] = React.useState<Announcement | null>(null);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const { locale } = useLocaleState();
  const t = getDict(locale);

  React.useEffect(() => {
    const savedDismissed = localStorage.getItem(DISMISS_KEY);
    if (savedDismissed) setDismissed(savedDismissed);

    supabase
      .from("announcements")
      .select("id, title_ar, title_en, body_ar, body_en, cta_ar, cta_en, cta_url, bg_color")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAnn(data[0] as Announcement);
        }
      });
  }, [supabase]);

  if (!ann || dismissed === ann.id) return null;

  const title = locale === "ar" ? ann.title_ar : ann.title_en || ann.title_ar;
  const body = locale === "ar" ? ann.body_ar : ann.body_en || ann.body_ar;
  const cta = locale === "ar" ? ann.cta_ar : ann.cta_en || ann.cta_ar;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, ann.id);
    setDismissed(ann.id);
  };

  return (
    <div
      className="w-full text-center text-sm py-2 px-4 flex items-center justify-center gap-3 relative"
      style={{
        background:
          ann.bg_color ||
          "linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
        color: "#0a0a0a",
      }}
    >
      <Megaphone className="h-4 w-4 flex-shrink-0" />
      <span className="font-medium">
        {title ? <strong>{title}: </strong> : null}
        {body}
      </span>
      {cta && ann.cta_url && (
        <Link
          href={ann.cta_url}
          className="underline underline-offset-2 font-bold hover:opacity-80"
        >
          {cta}
        </Link>
      )}
      <button
        onClick={dismiss}
        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10"
        aria-label="dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
