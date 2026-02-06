import { Router } from "express";
import {
  listPublicPlans,
  listAdminPlans,
  createPlanHandler,
  updatePlanHandler,
  deletePlanHandler,
  createCheckoutHandler,
  getMySubscription,
  stripeWebhookHandler,
} from "./controller";

const router = Router();

router.get("/plans", listPublicPlans);
router.get("/subscriptions/me", getMySubscription);
router.post("/subscriptions/checkout", createCheckoutHandler);

// Admin plan management
router.get("/admin/plans", listAdminPlans);
router.post("/admin/plans", createPlanHandler);
router.patch("/admin/plans/:id", updatePlanHandler);
router.delete("/admin/plans/:id", deletePlanHandler);

// Stripe webhook (expects raw body)
router.post("/subscriptions/webhook", stripeWebhookHandler);

export default router;
