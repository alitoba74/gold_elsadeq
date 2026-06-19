import { describe, it, expect } from "bun:test";
import {
  computePrices,
  convertFromEgp,
  formatPrice,
  relativeTime,
  TROY_OUNCE_IN_GRAMS,
} from "../gold/prices";

describe("computePrices", () => {
  it("computes per-gram 24K price from XAU/USD and USD/EGP", () => {
    const result = computePrices(2400, 50, "test");
    const expectedMid = (2400 / TROY_OUNCE_IN_GRAMS) * 50;
    // 24K mid should equal expected
    expect(Math.abs(result.gram24k - expectedMid)).toBeLessThan(0.01);
  });

  it("derives 21K from 24K with correct ratio", () => {
    const result = computePrices(2400, 50, "test");
    expect(result.gram21k).toBeCloseTo(result.gram24k * (21 / 24), 1);
  });

  it("derives 18K from 24K with correct ratio", () => {
    const result = computePrices(2400, 50, "test");
    expect(result.gram18k).toBeCloseTo(result.gram24k * (18 / 24), 1);
  });

  it("generates all expected item keys", () => {
    const result = computePrices(2400, 50, "test");
    const keys = result.items.map((i) => i.itemKey);
    expect(keys).toContain("gold_24k");
    expect(keys).toContain("gold_22k");
    expect(keys).toContain("gold_21k");
    expect(keys).toContain("gold_18k");
    expect(keys).toContain("gold_14k");
    expect(keys).toContain("pound");
    expect(keys).toContain("half_pound");
    expect(keys).toContain("quarter_pound");
    expect(keys).toContain("bar_1g");
    expect(keys).toContain("bar_1kg");
  });

  it("bar prices scale with weight + premium", () => {
    const result = computePrices(2400, 50, "test");
    const bar10g = result.items.find((i) => i.itemKey === "bar_10g")!;
    const bar100g = result.items.find((i) => i.itemKey === "bar_100g")!;
    // 100g should cost more than 10g
    expect(bar100g.sellPriceEgp).toBeGreaterThan(bar10g.sellPriceEgp);
  });

  it("gold pound = 8g of 21K + premium", () => {
    const result = computePrices(2400, 50, "test");
    const pound = result.items.find((i) => i.itemKey === "pound")!;
    const gram21kMid = result.gram21k;
    expect(pound.sellPriceEgp).toBeGreaterThan(gram21kMid * 8);
  });

  it("buy price is always less than sell price (spread)", () => {
    const result = computePrices(2400, 50, "test");
    for (const item of result.items) {
      expect(item.sellPriceEgp).toBeGreaterThanOrEqual(item.buyPriceEgp);
    }
  });
});

describe("convertFromEgp", () => {
  it("converts EGP to EGP (identity)", () => {
    expect(convertFromEgp(1000, "EGP", { EGP: 1, SAR: 0.075, AED: 0.073, KWD: 0.0062, QAR: 0.073 })).toBe(1000);
  });

  it("converts EGP to SAR correctly", () => {
    const rates = { EGP: 50, SAR: 3.75, AED: 3.67, KWD: 0.31, QAR: 3.64 };
    // 1000 EGP -> 1000 / 50 * 3.75 = 75 SAR
    expect(convertFromEgp(1000, "SAR", rates)).toBeCloseTo(75, 1);
  });

  it("returns original if rate missing", () => {
    expect(convertFromEgp(1000, "USD", {})).toBe(1000);
  });
});

describe("formatPrice", () => {
  it("formats with EGP symbol in Arabic", () => {
    const out = formatPrice(1000, "EGP", "ar");
    expect(out).toContain("ج.م");
  });

  it("formats with SAR symbol in English", () => {
    const out = formatPrice(75, "SAR", "en");
    expect(out).toContain("ر.س");
  });

  it("handles decimals", () => {
    const out = formatPrice(1234.56, "EGP", "en");
    expect(out).toMatch(/1,234\.56/);
  });
});

describe("relativeTime", () => {
  it("returns 'الآن' for very recent timestamps in Arabic", () => {
    const now = new Date().toISOString();
    expect(relativeTime(now, "ar")).toBe("الآن");
  });

  it("returns 'just now' for very recent timestamps in English", () => {
    const now = new Date().toISOString();
    expect(relativeTime(now, "en")).toBe("just now");
  });

  it("returns minutes for timestamps within last hour", () => {
    const ts = new Date(Date.now() - 30 * 1000).toISOString();
    expect(relativeTime(ts, "en")).toMatch(/30s ago/);
  });
});
