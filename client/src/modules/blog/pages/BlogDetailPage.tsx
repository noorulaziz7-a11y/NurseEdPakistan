import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import Seo from "@/shared/seo/Seo";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { fetchBlogPostBySlug } from "@/modules/blog/services/blogApi";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/v1/blog", slug],
    enabled: Boolean(slug),
    queryFn: () => fetchBlogPostBySlug(slug),
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground mb-4">Post not found.</p>
        <Link href="/blog">
          <Button variant="outline">Back to blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${post.title} | Nursing Educator Hub`}
        description={post.excerpt || "Nursing Educator Hub blog post."}
        canonicalPath={`/blog/${post.slug}`}
        imageUrl={post.coverImageUrl || "/images/logo.png"}
      />
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {post.publishedAt && (
                <Badge variant="secondary">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </Badge>
              )}
              {(post.tags || []).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
            {post.excerpt && (
              <p className="text-secondary-foreground/90 text-lg">{post.excerpt}</p>
            )}
            {post.author && (
              <p className="text-secondary-foreground/80">
                By {post.author}
                {post.authorTitle ? ` • ${post.authorTitle}` : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full rounded-2xl shadow-lg mb-8"
              loading="lazy"
            />
          )}
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
          <div className="mt-8">
            <Link href="/blog">
              <Button variant="outline">Back to blog</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
