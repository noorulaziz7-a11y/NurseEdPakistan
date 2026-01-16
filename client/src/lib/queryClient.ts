import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const [base, maybeParams, ...rest] = queryKey as unknown as [
      string,
      unknown,
      ...unknown[],
    ];

    let url = String(base);
    if (
      rest.length === 0 &&
      maybeParams &&
      typeof maybeParams === "object" &&
      !Array.isArray(maybeParams)
    ) {
      const params = new URLSearchParams();
      Object.entries(maybeParams as Record<string, unknown>).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params.append(key, String(value));
      });
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    } else if (queryKey.length > 1) {
      const parts = [base, maybeParams, ...rest].filter(
        (part) => part !== undefined && part !== null && part !== ""
      );
      url = parts.map(String).join("/");
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
