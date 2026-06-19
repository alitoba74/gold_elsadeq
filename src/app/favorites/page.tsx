"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { usePrices } from "@/hooks/use-prices";
import { PriceCard } from "@/components/elsadeq/price-card";
import { PriceCardSkeleton } from "@/components/elsadeq/price-card-skeleton";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const supabase = createClient();
  const { prices, rates, loading } = usePrices();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [favKeys, setFavKeys] = React.useState<string[]>([]);
  const [user, setUser] = React.useState<any>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setChecked(true);
      if (!user) return;
      setUser(user);
      supabase
        .from("user_favorites")
        .select("item_key")
        .eq("user_id", user.id)
        .then(({ data }) => {
          if (data) setFavKeys(data.map((r: any) => r.item_key));
        });
    });
  }, [supabase]);

  if (!checked) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-muted-foreground">{t.common.loading}</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 pb-24 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          {locale === "ar" ? "سجّل الدخول لحفظ مفضلاتك" : "Sign in to save favorites"}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg bg-gold-gradient text-black px-5 py-2 text-sm font-bold"
        >
          {t.nav.login}
        </Link>
      </div>
    );
  }

  const favs = prices.filter((p) => favKeys.includes(p.itemKey));

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display flex items-center gap-2">
          <Heart className="h-6 w-6 text-gold fill-gold" />
          {t.nav.profile}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "ar" ? "الأسعار المفضلة لديك" : "Your favorite prices"}
        </p>
      </header>

      {loading && prices.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PriceCardSkeleton key={i} />
          ))}
        </div>
      ) : favs.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">
          {locale === "ar"
            ? "لا توجد أسعار مفضلة بعد. تصفح الأسعار واضغط على القلب لإضافتها."
            : "No favorites yet. Browse prices and tap the heart to add."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {favs.map((row) => (
            <PriceCard key={row.itemKey} row={row} rates={rates} />
          ))}
        </div>
      )}
    </div>
  );
}
