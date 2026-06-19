import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Stores a contact message in contact_messages table.
 * Rate limited to 3 requests/minute per IP to prevent spam.
 */
export async function POST(req: NextRequest) {
  // Rate limit (3 per minute for contact form)
  const limited = rateLimit(req, 3);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "message too long" }, { status: 400 });
    }

    const admin = createAdminClient();
    const fwd = req.headers.get("x-forwarded-for");
    const ip = fwd?.split(",")[0]?.trim();
    const userAgent = req.headers.get("user-agent")?.slice(0, 500);

    const { error } = await admin.from("contact_messages").insert({
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      message: String(message).slice(0, 5000),
      ip,
      user_agent: userAgent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
