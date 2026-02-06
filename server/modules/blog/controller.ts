import type { Request, Response } from "express";
import {
  getNewsArticles,
  listPublicBlogPosts,
  listAdminBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./service";

export async function listNews(req: Request, res: Response) {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit.toString())
      : undefined;
    const featured =
      req.query.featured !== undefined
        ? req.query.featured?.toString() === "true"
        : undefined;
    const articles = await getNewsArticles(limit, featured);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listBlog(req: Request, res: Response) {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit.toString())
      : undefined;
    const posts = await listPublicBlogPosts(limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    const post = await getBlogPostBySlug(req.params.slug);
    if (!post || post.status !== "published") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listAdminBlog(req: Request, res: Response) {
  try {
    const status = req.query.status?.toString();
    const posts = await listAdminBlogPosts(status);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getAdminBlog(req: Request, res: Response) {
  try {
    const post = await getBlogPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createBlog(req: Request, res: Response) {
  try {
    const post = await createBlogPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const post = await updateBlogPost(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const ok = await deleteBlogPost(req.params.id);
    if (!ok) return res.status(404).json({ message: "Post not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
