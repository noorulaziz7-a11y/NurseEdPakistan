import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Seo from "@/shared/seo/Seo";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import {
  createBlogPost,
  deleteBlogPost,
  fetchAdminBlogPosts,
  updateBlogPost,
  type BlogPost,
} from "@/modules/blog/services/blogApi";

type FormState = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string;
  status: "draft" | "published";
  author: string;
  authorTitle: string;
};

const emptyForm: FormState = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  tags: "",
  status: "draft",
  author: "",
  authorTitle: "",
};

export default function BlogAdminPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/v1/admin/blog"],
    queryFn: () => fetchAdminBlogPosts(),
  });

  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/blog"] });
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BlogPost> }) =>
      updateBlogPost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/blog"] });
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/blog"] });
    },
  });

  const isEditing = Boolean(form.id);
  const submitLabel = isEditing ? "Update post" : "Create post";

  const payload = useMemo(() => {
    return {
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content,
      coverImageUrl: form.coverImageUrl || null,
      tags: form.tags
        ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
      status: form.status,
      author: form.author || null,
      authorTitle: form.authorTitle || null,
    };
  }, [form]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Blog Admin | Nursing Educator Hub"
        description="Manage blog content for Nursing Educator Hub."
        canonicalPath="/admin/blog"
        noIndex
      />
      <section className="bg-gradient-to-r from-secondary to-accent text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog Admin</h1>
            <p className="text-secondary-foreground/90">
              Create and manage SEO-friendly blog posts.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Post editor</h2>
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            />
            <Input
              placeholder="Cover image URL"
              value={form.coverImageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
              />
              <Input
                placeholder="Author title"
                value={form.authorTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, authorTitle: e.target.value }))}
              />
            </div>
            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value as FormState["status"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Markdown content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={10}
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  if (!form.title || !form.content) return;
                  if (isEditing && form.id) {
                    updateMutation.mutate({ id: form.id, payload });
                  } else {
                    createMutation.mutate(payload);
                  }
                }}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {submitLabel}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setForm(emptyForm)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing posts</h2>
          {isLoading && <p className="text-muted-foreground">Loading posts...</p>}
          {!isLoading && posts.length === 0 && (
            <p className="text-muted-foreground">No posts yet.</p>
          )}
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.status} • {post.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setForm({
                            id: post.id,
                            title: post.title,
                            excerpt: post.excerpt || "",
                            content: post.content,
                            coverImageUrl: post.coverImageUrl || "",
                            tags: (post.tags || []).join(", "),
                            status: (post.status as FormState["status"]) || "draft",
                            author: post.author || "",
                            authorTitle: post.authorTitle || "",
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
