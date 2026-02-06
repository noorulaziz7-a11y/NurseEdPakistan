CREATE TABLE IF NOT EXISTS "exam_attempts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "exam_id" integer NOT NULL REFERENCES "exams" ("id") ON DELETE CASCADE,
  "user_id" varchar REFERENCES "users" ("id") ON DELETE SET NULL,
  "status" text NOT NULL DEFAULT 'in_progress',
  "question_ids" jsonb NOT NULL,
  "difficulty_weights" jsonb,
  "current_question_index" integer DEFAULT 0,
  "time_limit_seconds" integer,
  "time_remaining_seconds" integer,
  "started_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "attempt_answers" (
  "attempt_id" varchar NOT NULL REFERENCES "exam_attempts" ("id") ON DELETE CASCADE,
  "mcq_id" varchar NOT NULL REFERENCES "mcqs" ("id") ON DELETE CASCADE,
  "selected_option_id" integer REFERENCES "mcq_options" ("id"),
  "is_correct" boolean DEFAULT false,
  "answered_at" timestamp DEFAULT now(),
  PRIMARY KEY ("attempt_id", "mcq_id")
);

CREATE TABLE IF NOT EXISTS "exam_results" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "attempt_id" varchar NOT NULL REFERENCES "exam_attempts" ("id") ON DELETE CASCADE,
  "exam_id" integer NOT NULL REFERENCES "exams" ("id") ON DELETE CASCADE,
  "user_id" varchar REFERENCES "users" ("id") ON DELETE SET NULL,
  "total_questions" integer NOT NULL,
  "correct_answers" integer NOT NULL,
  "score" integer NOT NULL,
  "time_spent_seconds" integer,
  "created_at" timestamp DEFAULT now()
);
