/**
 * Simple error logger - in production, swap for Sentry.
 * For now, logs to console + Supabase audit_logs.
 */
import { createAdminClient } from "@/lib/supabase/admin";

export async function logError(error: Error, context?: Record<string, any>) {
  // Always log to console
  console.error("[ELSADEQ ERROR]", error.message, context);

  // Try to log to Supabase (best-effort)
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      action: "error",
      entity: "system",
      details: {
        message: error.message,
        stack: error.stack?.slice(0, 2000),
        ...context,
      },
    });
  } catch {
    // Silent fail - don't crash on logging errors
  }
}

/**
 * Wrap an async handler with error logging.
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  handler: T,
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (e: any) {
      await logError(e, { args: args.slice(0, 2) });
      throw e;
    }
  }) as T;
}
