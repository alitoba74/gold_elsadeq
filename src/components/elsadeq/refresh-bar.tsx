"use client";

import * as React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocaleState } from "./locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { relativeTime } from "@/lib/gold/prices";

interface RefreshBarProps {
  lastUpdated: string | null;
  loading: boolean;
  fromCache: boolean;
  onRefresh: () => void;
}

export function RefreshBar({ lastUpdated, loading, fromCache, onRefresh }: RefreshBarProps) {
  const { locale } = useLocaleState();
  const t = getDict(locale);
  // Re-render every second to update the relative time
  const [, tick] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        {fromCache ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>
              {locale === "ar"
                ? "عرض آخر أسعار محفوظة (في انتظار الاتصال بالمصدر)"
                : "Showing cached prices (waiting for upstream)"}
            </span>
          </>
        ) : (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 live-pulse" />
            <span>{t.home.liveNow}</span>
          </>
        )}
        {lastUpdated && (
          <span className="text-muted-foreground/70">
            · {t.home.lastUpdate}: {relativeTime(lastUpdated, locale)}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="h-8 px-2 text-xs gap-1.5 hover:bg-gold/10"
      >
        <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
        {loading ? t.admin.refreshing : t.common.refresh}
      </Button>
    </div>
  );
}
