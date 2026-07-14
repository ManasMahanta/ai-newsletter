import type { MetadataRoute } from "next";
import { getAllIssues, getAllTags } from "@/lib/issues";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/issues",
    "/subscribe",
    "/start-here",
    "/about",
    "/privacy",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const issuePages = getAllIssues().map((issue) => ({
    url: `${site.url}/issues/${issue.slug}`,
    lastModified: new Date(`${issue.date}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const topicPages = getAllTags().map((tag) => ({
    url: `${site.url}/topics/${tag}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...issuePages, ...topicPages];
}
