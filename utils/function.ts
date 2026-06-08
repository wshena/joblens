import fetcher from "./fetcher";

export const getAllJobsCategory = () => {
  return fetcher({
    url: "/api/jobs/categories",
    method: "get",
    ttlMs: 10 * 60 * 1000,
  });
};
