import Stripe from "stripe";
import { db } from "../../db";
import {
  plans,
  userSubscriptions,
  payments,
  type InsertPlan,
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: "2023-10-16" })
  : null;

function requireStripe() {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return stripe;
}

export async function listPlans() {
  return db.select().from(plans).where(eq(plans.isActive, true)).orderBy(desc(plans.createdAt));
}

export async function listAllPlans() {
  return db.select().from(plans).orderBy(desc(plans.createdAt));
}

export async function createPlan(input: InsertPlan) {
  const [plan] = await db.insert(plans).values(input).returning();
  return plan;
}

export async function updatePlan(id: string, input: Partial<InsertPlan>) {
  const [plan] = await db
    .update(plans)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(plans.id, id))
    .returning();
  return plan;
}

export async function deletePlan(id: string) {
  const [deleted] = await db.delete(plans).where(eq(plans.id, id)).returning();
  return Boolean(deleted);
}

async function ensureStripePrice(planId: string) {
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));
  if (!plan) return null;

  if (plan.stripePriceId && plan.stripeProductId) {
    return plan;
  }

  const stripeClient = requireStripe();
  const product =
    plan.stripeProductId ||
    (
      await stripeClient.products.create({
        name: plan.name,
        description: plan.description || undefined,
      })
    ).id;

  const price =
    plan.stripePriceId ||
    (
      await stripeClient.prices.create({
        product,
        unit_amount: plan.priceCents,
        currency: plan.currency,
        recurring: { interval: plan.interval as Stripe.Price.Recurring.Interval },
      })
    ).id;

  const [updated] = await db
    .update(plans)
    .set({ stripeProductId: product, stripePriceId: price, updatedAt: new Date() })
    .where(eq(plans.id, plan.id))
    .returning();

  return updated || plan;
}

export async function createCheckoutSession(params: {
  planId: string;
  userId?: string | null;
  successUrl: string;
  cancelUrl: string;
}) {
  const plan = await ensureStripePrice(params.planId);
  if (!plan || !plan.stripePriceId) {
    throw new Error("Plan or Stripe price not found.");
  }

  const stripeClient = requireStripe();
  const session = await stripeClient.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.userId || undefined,
    metadata: {
      planId: plan.id,
      userId: params.userId || "",
    },
  });

  return session;
}

export async function upsertSubscriptionFromStripe(params: {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  planId: string;
  userId?: string | null;
  status?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean | null;
}) {
  const [existing] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.stripeSubscriptionId, params.stripeSubscriptionId || ""));

  if (existing) {
    const [updated] = await db
      .update(userSubscriptions)
      .set({
        status: params.status || existing.status,
        currentPeriodStart: params.currentPeriodStart || existing.currentPeriodStart,
        currentPeriodEnd: params.currentPeriodEnd || existing.currentPeriodEnd,
        cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? existing.cancelAtPeriodEnd,
        stripeCustomerId: params.stripeCustomerId || existing.stripeCustomerId,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(userSubscriptions)
    .values({
      userId: params.userId || null,
      planId: params.planId,
      status: params.status || "active",
      stripeCustomerId: params.stripeCustomerId || null,
      stripeSubscriptionId: params.stripeSubscriptionId || null,
      currentPeriodStart: params.currentPeriodStart || null,
      currentPeriodEnd: params.currentPeriodEnd || null,
      cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? false,
    })
    .returning();

  return created;
}

export async function recordPayment(params: {
  userId?: string | null;
  subscriptionId?: string | null;
  planId?: string | null;
  amountCents: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
}) {
  const [payment] = await db
    .insert(payments)
    .values({
      userId: params.userId || null,
      subscriptionId: params.subscriptionId || null,
      planId: params.planId || null,
      amountCents: params.amountCents,
      currency: params.currency,
      status: params.status,
      stripePaymentIntentId: params.stripePaymentIntentId || null,
      stripeInvoiceId: params.stripeInvoiceId || null,
    })
    .returning();
  return payment;
}

export async function getActiveSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .orderBy(desc(userSubscriptions.updatedAt));
  return subscription;
}

export function verifyStripeWebhookSignature(signature: string | undefined, rawBody: Buffer) {
  const stripeClient = requireStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }
  return stripeClient.webhooks.constructEvent(rawBody, signature || "", secret);
}
