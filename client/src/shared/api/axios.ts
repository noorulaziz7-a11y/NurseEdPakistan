import axios from "axios";
import { registerInterceptors } from "./interceptors";

const baseURL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

registerInterceptors(apiClient);
