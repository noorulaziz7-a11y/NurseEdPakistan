import { Router } from "express";
import { listStudyLibraries } from "./controller";

const router = Router();

router.get("/study-libraries", listStudyLibraries);

export default router;
