DROP TABLE "study_materials" CASCADE;--> statement-breakpoint
ALTER TABLE "study_library" ADD COLUMN "exam_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "study_library" DROP COLUMN "page_count";