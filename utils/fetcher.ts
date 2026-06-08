import axios, { AxiosRequestConfig, AxiosError } from "axios";

type HttpMethod = "get" | "post" | "put" | "delete";
type FetcherValue = string | number | boolean | null | undefined;
type FetcherParams = Record<string, FetcherValue>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

const memoryCache = new Map<string, { expiresAt: number; data: unknown }>();
const inFlightRequests = new Map<string, Promise<unknown>>();

const createRequestUrl = (url: string, params: FetcherParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Get the base URL for API requests
const getBaseURL = () => {
  // On the client side, relative URLs work fine
  if (typeof window !== "undefined") {
    return "";
  }
  // On the server side, we need the full URL
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`;
};

const fetcher = async ({
  url,
  params = {},
  method = "get",
  data,
  headers,
  ttlMs = DEFAULT_TTL_MS,
  noCache = false,
}: {
  url: string;
  params?: FetcherParams;
  method?: HttpMethod;
  data?: unknown;
  headers?: Record<string, string>;
  ttlMs?: number;
  noCache?: boolean;
}) => {
  const requestUrl = createRequestUrl(url, params);
  const cacheKey = `${method}:${requestUrl}`;
  const shouldCache = method === "get" && !noCache;

  if (shouldCache) {
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    const inFlight = inFlightRequests.get(cacheKey);
    if (inFlight) return inFlight;
  }

  const request = (async () => {
    const config: AxiosRequestConfig = {
      url: requestUrl,
      baseURL: getBaseURL(),
      method,
      headers: { "Content-Type": "application/json", ...headers },
      data: data ?? undefined,
    };

    const response = await axios(config);

    if (shouldCache) {
      memoryCache.set(cacheKey, {
        expiresAt: Date.now() + ttlMs,
        data: response.data,
      });
    }

    return response.data;
  })();

  if (shouldCache) inFlightRequests.set(cacheKey, request);

  try {
    return await request;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    let message = "Request failed";

    if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message;
    } else if (axiosError.response?.status) {
      message = `Request failed with status ${axiosError.response.status}`;
    } else if (axiosError.message) {
      message = axiosError.message;
    }

    throw new Error(message);
  } finally {
    if (shouldCache) inFlightRequests.delete(cacheKey);
  }
};

export default fetcher;
