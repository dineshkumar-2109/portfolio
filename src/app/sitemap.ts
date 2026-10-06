import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = portfolio.settings.seo.siteUrl;
  return base ? [{ url: base, changeFrequency: "monthly", priority: 1 }] : [];
}
