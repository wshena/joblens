import { NextRequest, NextResponse } from "next/server";
import { getJobs } from "@/utils/jobs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const jobs = await getJobs({
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      search: searchParams.get("search") ?? undefined,
      tags: searchParams.get("tags") ?? undefined,
      remote: searchParams.get("remote") === "true" ? true : undefined,
      visaSponsorship:
        searchParams.get("visa_sponsorship") === "true" ? true : undefined,
    });

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
