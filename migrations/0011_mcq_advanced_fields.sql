DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mcq_type_enum') THEN
    CREATE TYPE "mcq_type_enum" AS ENUM ('single', 'multiple', 'true_false');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mcq_rationale_type_enum') THEN
    CREATE TYPE "mcq_rationale_type_enum" AS ENUM ('detailed', 'quick', 'video');
  END IF;
END $$;

ALTER TABLE "mcqs"
  ADD COLUMN IF NOT EXISTS "type" "mcq_type_enum" NOT NULL DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS "image_url" text,
  ADD COLUMN IF NOT EXISTS "reference" text,
  ADD COLUMN IF NOT EXISTS "year" integer,
  ADD COLUMN IF NOT EXISTS "rationale_type" "mcq_rationale_type_enum";
