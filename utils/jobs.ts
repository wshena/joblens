import axios from "axios";

// ─── Unified Job type ────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  jobType: string; // "full_time" | "part_time" | "contract" dll
  tags: string[];
  description: string;
  applyUrl: string;
  postedAt: string; // ISO date string
  visaSponsorship: boolean;
  source: "arbeitnow";
}

export interface JobsResponse {
  data: Job[];
  meta: {
    currentPage: number;
    hasNextPage: boolean;
  };
}

// ─── Raw Arbeitnow response type ─────────────────────────────────────────────

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // unix timestamp
  visa_sponsorship: boolean;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── Normalizer ──────────────────────────────────────────────────────────────

const normalizeArbeitnow = (job: ArbeitnowJob): Job => ({
  id: `arbeitnow-${job.slug}`,
  title: job.title,
  company: job.company_name,
  location: job.location || "Not specified",
  remote: job.remote,
  jobType: job.job_types?.[0] ?? "full_time",
  tags: job.tags ?? [],
  description: job.description,
  applyUrl: job.url,
  postedAt: new Date(job.created_at * 1000).toISOString(),
  visaSponsorship: job.visa_sponsorship,
  source: "arbeitnow",
});

// ─── API functions (server-side safe) ────────────────────────────────────────

const ARBEITNOW_BASE = process.env.ARBEITNOW_BASE_API_URL!;

export interface GetJobsParams {
  page?: number;
  search?: string;
  tags?: string;
  remote?: boolean;
  visaSponsorship?: boolean;
}

export const getJobs = async (
  params: GetJobsParams = {},
): Promise<JobsResponse> => {
  const query: Record<string, string> = {};
  if (params.page) query.page = String(params.page);
  if (params.search) query.search = params.search;
  if (params.tags) query.tags = params.tags;
  if (params.remote !== undefined) query.remote = String(params.remote);
  if (params.visaSponsorship !== undefined)
    query.visa_sponsorship = String(params.visaSponsorship);

  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE, {
    params: query,
  });

  const { data, meta } = response.data;

  return {
    data: data.map(normalizeArbeitnow),
    meta: {
      currentPage: meta.current_page,
      hasNextPage: meta.current_page < meta.last_page,
    },
  };
};

// Ekstrak unique tags dari semua jobs untuk dipakai sebagai filter kategori
export const getJobTags = async (): Promise<string[]> => {
  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE);
  const allTags = response.data.data.flatMap((job) => job.tags);
  return [...new Set(allTags)].sort();
};
