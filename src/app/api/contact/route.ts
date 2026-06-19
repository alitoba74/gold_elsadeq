import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Stores a contact message in the audit_logs (since we don't have a dedicated contact_messages table).
 * In production, you can wire this to an email service or a dedicated table.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    const admin = createAdminClient();
    const { error } = await admin.from("audit_logs").insert({
      action: "contact_message",
      entity: "contact",
      details: { name, email, message },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
