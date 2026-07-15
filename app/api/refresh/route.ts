import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { triggerNaukriScrape } from "@/lib/jobs";

// Marks the homepage and radar's cached data stale so the next visitor gets
// freshly fetched content, instead of waiting for each source's own
// revalidate window to lapse naturally. Two ways to trigger it:
//  - Vercel Cron (see vercel.json) — auto-authenticated via the
//    `Authorization: Bearer $CRON_SECRET` header Vercel injects.
//  - Manually, by visiting /api/refresh?secret=<CRON_SECRET>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const queryParam = new URL(request.url).searchParams.get("secret");

  const authorized =
    !!secret && (authHeader === `Bearer ${secret}` || queryParam === secret);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/radar");
  revalidatePath("/agents");
  revalidatePath("/interview-prep");
  revalidateTag("daily-brief", "max");

  // Kick off a fresh Naukri scrape when the last one is stale (self-throttled
  // inside triggerNaukriScrape to stay within Apify's free credit).
  const naukri = await triggerNaukriScrape();

  return NextResponse.json({
    revalidated: true,
    naukriScrape: naukri,
    at: new Date().toISOString(),
  });
}
