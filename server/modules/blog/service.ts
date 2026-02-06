import { storage } from "../../storage";
import type { InsertBlogPost } from "@shared/schema";

export async function getNewsArticles(limit?: number, featured?: boolean) {
  return storage.getNewsArticles(limit, featured);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug || "post";
  let counter = 2;
  while (true) {
    const existing = await storage.getBlogPostBySlug(slug);
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function listPublicBlogPosts(limit?: number) {
  return storage.getBlogPosts({ status: "published", limit });
}

export async function listAdminBlogPosts(status?: string) {
  return storage.getBlogPosts({ status });
}

export async function getBlogPostBySlug(slug: string) {
  return storage.getBlogPostBySlug(slug);
}

export async function getBlogPostById(id: string) {
  return storage.getBlogPostById(id);
}

export async function createBlogPost(input: InsertBlogPost) {
  const baseSlug = input.slug || slugify(input.title);
  const slug = await ensureUniqueSlug(baseSlug);
  const isPublished = input.status === "published";
  return storage.createBlogPost({
    ...input,
    slug,
    publishedAt: isPublished ? input.publishedAt || new Date() : input.publishedAt,
  });
}

export async function updateBlogPost(id: string, input: Partial<InsertBlogPost>) {
  let slug = input.slug;
  if (input.title && !input.slug) {
    slug = slugify(input.title);
  }
  if (slug) {
    slug = await ensureUniqueSlug(slug, id);
  }
  const isPublished = input.status === "published";
  return storage.updateBlogPost(id, {
    ...input,
    slug: slug ?? input.slug,
    publishedAt: isPublished ? input.publishedAt || new Date() : input.publishedAt,
  });
}

export async function deleteBlogPost(id: string) {
  return storage.deleteBlogPost(id);
}
