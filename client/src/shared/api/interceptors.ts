import type { AxiosInstance } from "axios";

export function registerInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unexpected API error";
      return Promise.reject(new Error(message));
    }
  );
}
