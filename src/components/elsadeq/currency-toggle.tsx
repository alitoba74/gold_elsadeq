"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrencyState } from "./locale-state";

export const CURRENCIES = ["EGP", "SAR", "AED", "KWD", "QAR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const currencySymbols: Record<Currency, string> = {
  EGP: "ج.م",
  SAR: "ر.س",
  AED: "د.إ",
  KWD: "د.ك",
  QAR: "ر.ق",
};

export function CurrencyToggle({ value }: { value: Currency }) {
  const { setCurrency } = useCurrencyState();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 hover:bg-gold/10"
          aria-label="currency"
        >
          <span className="text-xs font-bold text-gold">{currencySymbols[value]}</span>
          <span className="text-[10px] text-muted-foreground uppercase hidden sm:inline">
            {value}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CURRENCIES.map((c) => (
          <DropdownMenuItem
            key={c}
            onClick={() => setCurrency(c)}
            className={
              "cursor-pointer justify-between " +
              (value === c ? "bg-gold/10 text-gold" : "")
            }
          >
            <span>{c}</span>
            <span className="text-muted-foreground">{currencySymbols[c]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
