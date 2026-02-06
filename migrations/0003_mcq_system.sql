CREATE TABLE IF NOT EXISTS "mcq_difficulty" (
  "id" serial PRIMARY KEY NOT NULL,
  "code" text NOT NULL,
  "label" text NOT NULL,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "mcq_difficulty_code_unique" ON "mcq_difficulty" ("code");

CREATE TABLE IF NOT EXISTS "mcqs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "stem" text NOT NULL,
  "explanation" text,
  "difficulty_id" integer REFERENCES "mcq_difficulty" ("id"),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "mcq_options" (
  "id" serial PRIMARY KEY NOT NULL,
  "mcq_id" varchar NOT NULL REFERENCES "mcqs" ("id") ON DELETE CASCADE,
  "option_text" text NOT NULL,
  "is_correct" boolean DEFAULT false,
  "position" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "mcq_tags" (
  "id" serial PRIMARY KEY NOT NULL,
  "mcq_id" varchar NOT NULL REFERENCES "mcqs" ("id") ON DELETE CASCADE,
  "tag" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "exam_mcqs" (
  "exam_id" integer NOT NULL REFERENCES "exams" ("id") ON DELETE CASCADE,
  "mcq_id" varchar NOT NULL REFERENCES "mcqs" ("id") ON DELETE CASCADE,
  "position" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  PRIMARY KEY ("exam_id", "mcq_id")
);
