ALTER TABLE "exams"
  ADD COLUMN IF NOT EXISTS "category" text,
  ADD COLUMN IF NOT EXISTS "description" text,
  ADD COLUMN IF NOT EXISTS "duration_minutes" integer,
  ADD COLUMN IF NOT EXISTS "scoring_rules" jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS "access_level" text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS "badge" varchar(20),
  ADD COLUMN IF NOT EXISTS "badge_color" varchar(50),
  ADD COLUMN IF NOT EXISTS "progress" integer DEFAULT 0;
