import { Router } from "express";
import {
  getUser,
  listPracticeTests,
  createPracticeTestHandler,
  analytics,
} from "./controller";

const router = Router();

router.get("/users/:id", getUser);
router.get("/practice-tests", listPracticeTests);
router.post("/practice-tests", createPracticeTestHandler);
router.get("/analytics", analytics);

export default router;
