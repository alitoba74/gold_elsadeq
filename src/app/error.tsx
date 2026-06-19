"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Logo } from "@/components/elsadeq/logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console (in production this would go to Sentry)
    console.error("[ELSADEQ ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="xl" />
        </div>

        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gold-gradient font-display">
          حدث خطأ / Something Went Wrong
        </h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          عذراً، حدث خطأ غير متوقع. حاول مرة أخرى أو عُدم للصفحة الرئيسية.
          <br />
          Sorry, an unexpected error occurred. Please try again or return home.
        </p>

        {error?.message && (
          <details className="mb-6 text-start">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              تفاصيل الخطأ / Error details
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-muted/50 text-[10px] overflow-x-auto text-muted-foreground">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={reset}
            className="bg-gold-gradient text-black hover:opacity-90 font-bold"
          >
            <RefreshCw className="h-4 w-4 me-2" />
            إعادة المحاولة / Retry
          </Button>
          <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
            <Link href="/">
              <Home className="h-4 w-4 me-2" />
              الرئيسية / Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
