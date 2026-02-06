import { Router } from "express";
import { listColleges, getCollege } from "./controller";

const router = Router();

router.get("/colleges", listColleges);
router.get("/colleges/:id", getCollege);

export default router;
