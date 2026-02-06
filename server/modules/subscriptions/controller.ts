import type { Request, Response } from "express";
import {
  listPlans,
  listAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  createCheckoutSession,
  verifyStripeWebhookSignature,
  upsertSubscriptionFromStripe,
  recordPayment,
  getActiveSubscription,
} from "./service";

export async function listPublicPlans(_req: Request, res: Response) {
  try {
    const plans = await listPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listAdminPlans(_req: Request, res: Response) {
  try {
    const plans = await listAllPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createPlanHandler(req: Request, res: Response) {
  try {
    const plan = await createPlan(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updatePlanHandler(req: Request, res: Response) {
  try {
    const plan = await updatePlan(req.params.id, req.body);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function deletePlanHandler(req: Request, res: Response) {
  try {
    const ok = await deletePlan(req.params.id);
    if (!ok) return res.status(404).json({ message: "Plan not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function createCheckoutHandler(req: Request, res: Response) {
  try {
    const { planId, successUrl, cancelUrl } = req.body || {};
    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({ message: "planId, successUrl, cancelUrl required" });
    }
    const session = await createCheckoutSession({
      planId,
      userId: req.session.userId || null,
      successUrl,
      cancelUrl,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error", error });
  }
}

export async function getMySubscription(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json(null);
    const subscription = await getActiveSubscription(userId);
    res.json(subscription || null);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function stripeWebhookHandler(req: Request, res: Response) {
  try {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const rawBody = req.body as Buffer;
    const event = verifyStripeWebhookSignature(signature, rawBody);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const metadata = session.metadata || {};
      const planId = metadata.planId;
      const userId = metadata.userId || null;

      const subscription = await upsertSubscriptionFromStripe({
        stripeCustomerId: session.customer || null,
        stripeSubscriptionId: session.subscription || null,
        planId,
        userId,
        status: "active",
      });

      if (session.amount_total && session.currency) {
        await recordPayment({
          userId,
          subscriptionId: subscription?.id || null,
          planId,
          amountCents: session.amount_total,
          currency: session.currency,
          status: "succeeded",
          stripePaymentIntentId: session.payment_intent || null,
          stripeInvoiceId: session.invoice || null,
        });
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({ message: error?.message || "Webhook error" });
  }
}
