import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gold_elsadeq.vercel.app";
  const now = new Date();
  const routes = [
    "",
    "/gold",
    "/bars",
    "/coins",
    "/calculator",
    "/converter",
    "/charts",
    "/news",
    "/faq",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: r === "" ? 1 : 0.8,
  }));
}
