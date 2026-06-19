/**
 * Client-side helpers to call the ELSADEQ API routes.
 * These route handlers run on the server and use the service_role key.
 */

export async function refreshPricesViaApi(): Promise<{
  ok: boolean;
  source: string;
  fetchedAt: string;
  fromCache: boolean;
  rates?: Record<string, number>;
  itemsCount?: number;
} | null> {
  try {
    const resp = await fetch("/api/prices/refresh", {
      method: "POST",
      cache: "no-store",
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    console.warn("[client-fetch] refresh error:", (e as Error).message);
    return null;
  }
}

export async function getLatestRatesViaApi(): Promise<Record<string, number> | null> {
  try {
    const resp = await fetch("/api/prices/rates", { method: "GET", cache: "no-store" });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data?.rates || null;
  } catch (e) {
    console.warn("[client-fetch] rates error:", (e as Error).message);
    return null;
  }
}

export async function getHistoryViaApi(
  itemKey: string,
  range: "24h" | "7d" | "30d" | "1y",
): Promise<{ recordedAt: string; price: number }[]> {
  try {
    const resp = await fetch(
      `/api/prices/history?item=${encodeURIComponent(itemKey)}&range=${range}`,
      { cache: "no-store" },
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    return data?.data || [];
  } catch (e) {
    console.warn("[client-fetch] history error:", (e as Error).message);
    return [];
  }
}
