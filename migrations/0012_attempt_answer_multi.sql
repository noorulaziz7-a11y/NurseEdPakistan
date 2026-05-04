ALTER TABLE "attempt_answers"
  ADD COLUMN IF NOT EXISTS "selected_option_ids" jsonb;
