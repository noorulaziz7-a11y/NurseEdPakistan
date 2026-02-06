CREATE TABLE IF NOT EXISTS "difficulty_levels" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "difficulty_levels_name_unique" ON "difficulty_levels" ("name");

DO $$
BEGIN
  IF to_regclass('public.mcq_difficulty') IS NOT NULL THEN
    INSERT INTO "difficulty_levels" ("id", "name")
    SELECT "id", "code" FROM "mcq_difficulty"
    ON CONFLICT ("id") DO NOTHING;
  END IF;
END $$;

INSERT INTO "difficulty_levels" ("name")
VALUES ('easy'), ('medium'), ('hard')
ON CONFLICT ("name") DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('difficulty_levels', 'id'),
  COALESCE((SELECT MAX("id") FROM "difficulty_levels"), 1),
  true
);

ALTER TABLE "mcqs" ADD COLUMN IF NOT EXISTS "question" text;
UPDATE "mcqs" SET "question" = "stem" WHERE "question" IS NULL;
ALTER TABLE "mcqs" ALTER COLUMN "question" SET NOT NULL;

ALTER TABLE "mcqs" ADD COLUMN IF NOT EXISTS "created_by" varchar;

ALTER TABLE "mcqs" DROP CONSTRAINT IF EXISTS "mcqs_difficulty_id_mcq_difficulty_id_fk";
ALTER TABLE "mcqs"
  ADD CONSTRAINT "mcqs_difficulty_id_difficulty_levels_id_fk"
  FOREIGN KEY ("difficulty_id") REFERENCES "difficulty_levels" ("id") ON DELETE SET NULL;

ALTER TABLE "mcqs" DROP CONSTRAINT IF EXISTS "mcqs_created_by_users_id_fk";
ALTER TABLE "mcqs"
  ADD CONSTRAINT "mcqs_created_by_users_id_fk"
  FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;
