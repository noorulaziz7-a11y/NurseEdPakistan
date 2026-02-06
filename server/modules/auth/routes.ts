import { Router } from "express";
import { register, login, me, logout, refresh } from "./controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", me);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refresh);

export default router;
