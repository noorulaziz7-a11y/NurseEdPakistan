CREATE TABLE IF NOT EXISTS "exam_subjects" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "exam_id" integer NOT NULL REFERENCES "exams" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "exam_subjects_exam_id_idx" ON "exam_subjects" ("exam_id");
CREATE INDEX IF NOT EXISTS "exam_subjects_name_idx" ON "exam_subjects" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "exam_subjects_exam_id_name_unique" ON "exam_subjects" ("exam_id", "name");

CREATE TABLE IF NOT EXISTS "exam_topics" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "exam_id" integer NOT NULL REFERENCES "exams" ("id") ON DELETE CASCADE,
  "section_id" varchar,
  "subject_id" varchar REFERENCES "exam_subjects" ("id") ON DELETE SET NULL,
  "parent_topic_id" varchar,
  "title" text NOT NULL,
  "description" text,
  "weight" integer DEFAULT 0,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "exam_topics_exam_id_idx" ON "exam_topics" ("exam_id");
CREATE INDEX IF NOT EXISTS "exam_topics_subject_id_idx" ON "exam_topics" ("subject_id");
CREATE INDEX IF NOT EXISTS "exam_topics_parent_topic_id_idx" ON "exam_topics" ("parent_topic_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_topics_parent_topic_id_fk') THEN
    ALTER TABLE "exam_topics"
      ADD CONSTRAINT "exam_topics_parent_topic_id_fk"
      FOREIGN KEY ("parent_topic_id") REFERENCES "exam_topics" ("id")
      ON DELETE SET NULL;
  END IF;
END $$;

-- Backfill default subjects for every existing exam.
INSERT INTO "exam_subjects" ("exam_id", "name", "sort_order")
SELECT e.id, v.name, v.sort_order
FROM "exams" e
CROSS JOIN (
  VALUES
    ('Medical-Surgical', 0),
    ('Pediatrics', 1),
    ('Pharmacology', 2),
    ('Mental Health', 3),
    ('Maternal-Newborn', 4),
    ('Fundamentals', 5),
    ('Critical Care', 6),
    ('Community Health', 7),
    ('Leadership', 8),
    ('Emergency', 9),
    ('Ethics', 10)
) AS v(name, sort_order)
ON CONFLICT DO NOTHING;

