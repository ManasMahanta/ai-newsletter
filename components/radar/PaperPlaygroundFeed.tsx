import { getTrendingPapers } from "@/lib/radar";
import { EmptyFeed } from "@/components/radar/Feeds";
import PaperPlayground from "@/components/radar/PaperPlayground";

export default async function PaperPlaygroundFeed() {
  const papers = await getTrendingPapers(6);
  if (papers.length === 0) return <EmptyFeed />;
  return <PaperPlayground papers={papers} />;
}
