import { apiClient } from "@/shared/api/axios";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  author?: string | null;
  authorTitle?: string | null;
  status: string;
  tags?: string[] | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function fetchBlogPosts(limit?: number) {
  const res = await apiClient.get<BlogPost[]>("/api/v1/blog", {
    params: limit ? { limit } : undefined,
  });
  return res.data;
}

export async function fetchBlogPostBySlug(slug: string) {
  const res = await apiClient.get<BlogPost>(`/api/v1/blog/${slug}`);
  return res.data;
}

export async function fetchAdminBlogPosts(status?: string) {
  const res = await apiClient.get<BlogPost[]>("/api/v1/admin/blog", {
    params: status ? { status } : undefined,
  });
  return res.data;
}

export async function createBlogPost(payload: Partial<BlogPost>) {
  const res = await apiClient.post<BlogPost>("/api/v1/admin/blog", payload);
  return res.data;
}

export async function updateBlogPost(id: string, payload: Partial<BlogPost>) {
  const res = await apiClient.patch<BlogPost>(`/api/v1/admin/blog/${id}`, payload);
  return res.data;
}

export async function deleteBlogPost(id: string) {
  const res = await apiClient.delete<{ success: boolean }>(`/api/v1/admin/blog/${id}`);
  return res.data;
}
