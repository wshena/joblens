import axios from "axios";

// ─── Unified Job type ────────────────────────────────────────────────────────

export interface TagWithCount {
  name: string;
  count: number;
}

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
  total: number;
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
// const REMOTIVE_BASE = process.env.REMOTIVE_BASE_API_URL!;

export interface GetJobsParams {
  page?: number;
  limit?: number;
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
  if (params.remote !== undefined) query.remote = String(params.remote);
  if (params.visaSponsorship !== undefined)
    query.visa_sponsorship = String(params.visaSponsorship);

  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE, {
    params: query,
  });

  const rawJobs = response.data.data || [];
  const metaAPI = response.data.meta;

  const page = params.page || 1;
  const limit = params.limit || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRawJobs = rawJobs.slice(startIndex, endIndex);

  const totalItems = metaAPI?.total || rawJobs.length;

  return {
    data: paginatedRawJobs.map(normalizeArbeitnow),
    total: totalItems,
    meta: {
      currentPage: page,
      hasNextPage:
        endIndex < rawJobs.length || metaAPI?.current_page < metaAPI?.last_page,
    },
  };
};

// Ekstrak unique tags dari semua jobs untuk dipakai sebagai filter kategori
export const getJobTags = async (): Promise<string[]> => {
  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE);
  const allTags = response.data.data.flatMap((job) => job.tags);
  return [...new Set(allTags)].sort();
};

// filter job list menggunakan tags
export const getFilteredJobByTags = async (
  tag: string,
  page: number = 1,
  limit: number = 10,
): Promise<JobsResponse> => {
  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE);
  const jobs = response?.data?.data || [];

  const searchTag = tag.toLowerCase();

  const filteredRawJobs = jobs.filter((job) =>
    job.tags?.some((t) => t.toLowerCase() === searchTag),
  );

  const totalItems = filteredRawJobs.length;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedRawJobs = filteredRawJobs.slice(startIndex, endIndex);

  const hasNextPage = endIndex < totalItems;

  return {
    data: paginatedRawJobs.map(normalizeArbeitnow),
    total: totalItems,
    meta: {
      currentPage: page,
      hasNextPage: hasNextPage,
    },
  };
};

// get random tags with count
export const getRandomTagsWithCount = async (
  limitCount: number = 6,
): Promise<TagWithCount[]> => {
  const response = await axios.get<ArbeitnowResponse>(ARBEITNOW_BASE);
  const jobs = response?.data?.data || [];

  const tagCounts: Record<string, number> = {};

  jobs.forEach((job) => {
    job.tags?.forEach((tag) => {
      const normalizedTag = tag.trim();
      if (normalizedTag) {
        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
      }
    });
  });

  const allTagsWithCount: TagWithCount[] = Object.keys(tagCounts).map(
    (tagName) => ({
      name: tagName,
      count: tagCounts[tagName],
    }),
  );

  const shuffledTags = allTagsWithCount.sort(() => 0.5 - Math.random());

  return shuffledTags.slice(0, limitCount);
};
