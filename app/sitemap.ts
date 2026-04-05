import { MetadataRoute } from "next";
import { getCategories, getPostsByCategory } from "@/lib/content";

const BASE_URL = "https://blog.akashtharindu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/${category}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postUrls: MetadataRoute.Sitemap = categories.flatMap((category) =>
    getPostsByCategory(category).map((post) => ({
      url: `${BASE_URL}/${category}/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categoryUrls,
    ...postUrls,
  ];
}
