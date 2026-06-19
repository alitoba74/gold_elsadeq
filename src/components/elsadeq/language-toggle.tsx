"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleState } from "./locale-state";
import { locales, type Locale } from "@/lib/i18n/config";

export function LanguageToggle({ locale: current }: { locale: Locale }) {
  const { setLocale } = useLocaleState();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 hover:bg-gold/10"
          aria-label="language"
        >
          <Globe className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold uppercase">
            {current === "ar" ? "ع" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={
              "cursor-pointer " + (current === l ? "bg-gold/10 text-gold" : "")
            }
          >
            {l === "ar" ? "العربية" : "English"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
