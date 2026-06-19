"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * OAuth callback handler - exchanges the code for a session and redirects home.
 */
export default function AuthCallbackPage() {
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.replace("/");
      router.refresh();
    });
  }, [supabase, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
