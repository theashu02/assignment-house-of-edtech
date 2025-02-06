"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogData {
  _id: string;
  title: string;
  content: string;
}

export default function EditBlog({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/my-blogs`);
      if (response.ok) {
        const blogs = await response.json();
        const currentBlog = blogs.find((b: BlogData) => b._id === params.id);
        if (currentBlog) {
          setBlog(currentBlog);
        } else {
          router.push('/my-blogs');
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setSaving(true);
    try {
      const response = await fetch('/api/blogs/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: blog._id,
          title: blog.title,
          content: blog.content,
        }),
      });

      if (response.ok) {
        router.push('/my-blogs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update blog');
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-8">Loading...</div>;
  }

  if (!blog) {
    return <div className="container mt-8">Blog not found</div>;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={blog.content}
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                rows={10}
                required
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/my-blogs')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 