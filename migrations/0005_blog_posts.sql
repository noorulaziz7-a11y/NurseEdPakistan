CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image_url" text,
  "author" text,
  "author_title" text,
  "status" text NOT NULL DEFAULT 'draft',
  "tags" jsonb DEFAULT '[]',
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_unique" ON "blog_posts" ("slug");
