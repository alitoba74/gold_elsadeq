"use client";

import * as React from "react";
import {
  type Locale,
  locales,
  defaultLocale,
} from "@/lib/i18n/config";
import { CURRENCIES, type Currency } from "./currency-toggle";

const LOCALE_KEY = "elsadeq.locale";
const CURRENCY_KEY = "elsadeq.currency";

interface LocaleStateContext {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const LocaleStateContext = React.createContext<LocaleStateContext | null>(null);

export function LocaleStateProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);
  const [currency, setCurrencyState] = React.useState<Currency>("EGP");

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    try {
      const savedL = localStorage.getItem(LOCALE_KEY) as Locale | null;
      if (savedL && locales.includes(savedL)) {
        setLocaleState(savedL);
      } else {
        // Detect from browser
        const nav = navigator.language.toLowerCase();
        if (nav.startsWith("ar")) setLocaleState("ar");
        else setLocaleState("en");
      }
      const savedC = localStorage.getItem(CURRENCY_KEY) as Currency | null;
      if (savedC && CURRENCIES.includes(savedC)) {
        setCurrencyState(savedC);
      }
    } catch {}
  }, []);

  // Apply html dir/lang + persist
  React.useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {}
  }, [locale]);

  React.useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, currency);
    } catch {}
  }, [currency]);

  const setLocale = React.useCallback((l: Locale) => setLocaleState(l), []);
  const setCurrency = React.useCallback((c: Currency) => setCurrencyState(c), []);

  return (
    <LocaleStateContext.Provider value={{ locale, setLocale, currency, setCurrency }}>
      {children}
    </LocaleStateContext.Provider>
  );
}

export function useLocaleState() {
  const ctx = React.useContext(LocaleStateContext);
  if (!ctx) {
    // Provide safe defaults so SSR + first render don't crash
    return {
      locale: defaultLocale,
      setLocale: () => {},
      currency: "EGP" as Currency,
      setCurrency: () => {},
    };
  }
  return ctx;
}

export function useCurrencyState() {
  const { currency, setCurrency } = useLocaleState();
  return { currency, setCurrency };
}
