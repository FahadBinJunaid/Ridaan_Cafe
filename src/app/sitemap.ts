import type { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rindaan-cafe.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const supabase = createServiceClient();
    const { data: categories } = await supabase
      .from("categories")
      .select("name")
      .order("display_order");

    const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((cat) => {
      const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
      return {
        url: `${baseUrl}/menu#${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      };
    });

    return [...staticPages, ...categoryUrls];
  } catch {
    return staticPages;
  }
}
