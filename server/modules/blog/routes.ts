import { Router } from "express";
import {
  listNews,
  listBlog,
  getBlog,
  listAdminBlog,
  getAdminBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./controller";

const router = Router();

router.get("/news", listNews);
router.get("/blog", listBlog);
router.get("/blog/:slug", getBlog);
router.get("/admin/blog", listAdminBlog);
router.get("/admin/blog/:id", getAdminBlog);
router.post("/admin/blog", createBlog);
router.patch("/admin/blog/:id", updateBlog);
router.delete("/admin/blog/:id", deleteBlog);

export default router;
