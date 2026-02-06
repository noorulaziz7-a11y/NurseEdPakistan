CREATE TABLE IF NOT EXISTS "plans" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "price_cents" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'usd',
  "interval" text NOT NULL DEFAULT 'month',
  "stripe_product_id" text,
  "stripe_price_id" text,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_subscriptions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar REFERENCES "users" ("id") ON DELETE SET NULL,
  "plan_id" varchar REFERENCES "plans" ("id") ON DELETE SET NULL,
  "status" text NOT NULL DEFAULT 'active',
  "stripe_customer_id" text,
  "stripe_subscription_id" text,
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "cancel_at_period_end" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payments" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar REFERENCES "users" ("id") ON DELETE SET NULL,
  "subscription_id" varchar REFERENCES "user_subscriptions" ("id") ON DELETE SET NULL,
  "plan_id" varchar REFERENCES "plans" ("id") ON DELETE SET NULL,
  "amount_cents" integer NOT NULL,
  "currency" text NOT NULL DEFAULT 'usd',
  "status" text NOT NULL DEFAULT 'pending',
  "stripe_payment_intent_id" text,
  "stripe_invoice_id" text,
  "created_at" timestamp DEFAULT now()
);
