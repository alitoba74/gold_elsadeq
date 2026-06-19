import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side helper: verify the current user is an admin.
 * Returns { user, isAdmin, error? }
 */
export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      isAdmin: false,
      error: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return {
      user,
      isAdmin: false,
      error: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }

  return { user, isAdmin: true, error: null };
}
