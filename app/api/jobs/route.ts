import { NextRequest, NextResponse } from "next/server";
import { getJobs, getFilteredJobByTags } from "@/utils/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tagParam = searchParams.get("tags")?.toLowerCase();

  try {
    let jobs;

    if (tagParam) {
      jobs = await getFilteredJobByTags(tagParam);
    } else {
      jobs = await getJobs({
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        search: searchParams.get("search") ?? undefined,
        remote: searchParams.get("remote") === "true" ? true : undefined,
        visaSponsorship:
          searchParams.get("visa_sponsorship") === "true" ? true : undefined,
      });
    }

    return NextResponse.json(jobs, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
