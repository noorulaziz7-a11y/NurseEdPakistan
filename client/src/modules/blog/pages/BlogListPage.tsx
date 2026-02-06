import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Seo from "@/shared/seo/Seo";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { fetchBlogPosts } from "@/modules/blog/services/blogApi";

export default function BlogListPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/v1/blog"],
    queryFn: () => fetchBlogPosts(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Blog | Nursing Educator Hub"
        description="Latest insights, exam tips, and nursing education updates."
        canonicalPath="/blog"
      />
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-secondary-foreground/90">
              Latest insights, exam strategies, and clinical updates for nursing students.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && <p className="text-muted-foreground">Loading posts...</p>}
        {!isLoading && posts.length === 0 && (
          <p className="text-muted-foreground">No posts yet. Check back soon.</p>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Draft"}
                  </Badge>
                  {(post.tags || []).slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || "Read the full article to learn more."}
                  </p>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="default">Read more</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
