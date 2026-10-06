import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio";

export default function robots(): MetadataRoute.Robots {
  const base = portfolio.settings.seo.siteUrl;
  return { rules: { userAgent: "*", allow: "/" }, ...(base ? { sitemap: `${base.replace(/\/$/, "")}/sitemap.xml` } : {}) };
}
