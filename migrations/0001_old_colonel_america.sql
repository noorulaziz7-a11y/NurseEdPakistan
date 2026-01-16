CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"badge" varchar(20),
	"badge_color" varchar(50),
	"progress" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "guest_quiz_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"quiz_count" integer DEFAULT 0,
	"last_quiz_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ielts_modules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"module_type" text NOT NULL,
	"total_questions" integer DEFAULT 0,
	"answered_questions" integer DEFAULT 0,
	"correct_answers" integer DEFAULT 0,
	"average_score" integer DEFAULT 0,
	"last_practice_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_id" text NOT NULL,
	"exam_type" text NOT NULL,
	"module_type" text,
	"current_question_index" integer DEFAULT 0,
	"selected_answers" jsonb DEFAULT '{}'::jsonb,
	"time_spent" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_id" text NOT NULL,
	"exam_type" text NOT NULL,
	"module_type" text,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"incorrect_answers" integer NOT NULL,
	"score" integer NOT NULL,
	"time_spent" integer,
	"answers" jsonb NOT NULL,
	"subjects" jsonb,
	"difficulty" text,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "study_library" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"type" text NOT NULL,
	"level" text NOT NULL,
	"is_premium" boolean DEFAULT false,
	"file_url" text,
	"page_count" integer,
	"duration" text,
	"rating" integer,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "study_materials" ADD COLUMN "exam_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ielts_modules" ADD CONSTRAINT "ielts_modules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_progress" ADD CONSTRAINT "quiz_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_materials" DROP COLUMN "page_count";