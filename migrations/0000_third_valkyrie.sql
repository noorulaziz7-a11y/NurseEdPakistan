CREATE TABLE "colleges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"type" text NOT NULL,
	"programs" jsonb NOT NULL,
	"admission_fee" integer,
	"rating" integer,
	"review_count" integer DEFAULT 0,
	"description" text,
	"contact" jsonb,
	"accreditation" jsonb
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_type" text NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_answer" text NOT NULL,
	"explanation" text NOT NULL,
	"difficulty" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"author" text NOT NULL,
	"author_title" text,
	"image_url" text,
	"published_at" timestamp DEFAULT now(),
	"featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "practice_tests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"exam_type" text NOT NULL,
	"questions_answered" integer DEFAULT 0,
	"correct_answers" integer DEFAULT 0,
	"total_questions" integer DEFAULT 50,
	"time_spent" integer,
	"completed_at" timestamp,
	"score" integer
);
--> statement-breakpoint
CREATE TABLE "study_materials" (
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
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"exam_progress" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"last_login_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "practice_tests" ADD CONSTRAINT "practice_tests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;