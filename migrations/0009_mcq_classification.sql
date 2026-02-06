DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mcq_difficulty_enum') THEN
    CREATE TYPE "mcq_difficulty_enum" AS ENUM ('easy', 'moderate', 'hard');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mcq_system_enum') THEN
    CREATE TYPE "mcq_system_enum" AS ENUM (
      'Cardiovascular',
      'Respiratory',
      'Neurological',
      'Gastrointestinal',
      'Renal',
      'Endocrine',
      'Musculoskeletal',
      'Reproductive',
      'Hematology',
      'Immune',
      'Integumentary'
    );
  END IF;
END $$;

ALTER TABLE "mcqs"
  ADD COLUMN IF NOT EXISTS "exam_id" integer,
  ADD COLUMN IF NOT EXISTS "subject_id" varchar,
  ADD COLUMN IF NOT EXISTS "topic_id" varchar,
  ADD COLUMN IF NOT EXISTS "difficulty" "mcq_difficulty_enum" NOT NULL DEFAULT 'moderate',
  ADD COLUMN IF NOT EXISTS "system" "mcq_system_enum" NOT NULL DEFAULT 'Cardiovascular';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mcqs_exam_id_exams_id_fk'
  ) THEN
    ALTER TABLE "mcqs"
      ADD CONSTRAINT "mcqs_exam_id_exams_id_fk"
      FOREIGN KEY ("exam_id") REFERENCES "exams"("id")
      ON DELETE CASCADE;
  END IF;

  IF to_regclass('public.exam_subjects') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'mcqs_subject_id_exam_subjects_id_fk'
    ) THEN
      ALTER TABLE "mcqs"
        ADD CONSTRAINT "mcqs_subject_id_exam_subjects_id_fk"
        FOREIGN KEY ("subject_id") REFERENCES "exam_subjects"("id")
        ON DELETE CASCADE;
    END IF;
  END IF;

  IF to_regclass('public.exam_topics') IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'mcqs_topic_id_exam_topics_id_fk'
    ) THEN
      ALTER TABLE "mcqs"
        ADD CONSTRAINT "mcqs_topic_id_exam_topics_id_fk"
        FOREIGN KEY ("topic_id") REFERENCES "exam_topics"("id")
        ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "mcqs_exam_id_idx" ON "mcqs" ("exam_id");
CREATE INDEX IF NOT EXISTS "mcqs_subject_id_idx" ON "mcqs" ("subject_id");
CREATE INDEX IF NOT EXISTS "mcqs_topic_id_idx" ON "mcqs" ("topic_id");
CREATE INDEX IF NOT EXISTS "mcqs_difficulty_idx" ON "mcqs" ("difficulty");
CREATE INDEX IF NOT EXISTS "mcqs_system_idx" ON "mcqs" ("system");
