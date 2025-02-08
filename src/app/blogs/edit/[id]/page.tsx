"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Loader2, ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import axios from "axios"
import LoadingSpinner from "@/app/common/LoadingSpinner";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  // const {id} = await params;
  // useEffect(() => {
  //   fetchBlog();
  // }, [params.id]);
   const [id, setId] = useState<string | null>(null);

  // const fetchBlog = async () => {
  //   try {
  //     const response = await fetch(`/api/my-blogs`);
  //     if (response.ok) {
  //       const blogs = await response.json();
  //       const currentBlog = blogs.find((b: BlogData) => b._id === params.id);
  //       if (currentBlog) {
  //         setBlog(currentBlog);
  //       } else {
  //         router.push("/my-blogs");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching blog:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    // Resolve the params promise
    const fetchParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  // const fetchBlog = async (blogId: string) => {
  //   try {
  //     const response = await fetch(`/api/my-blogs`);
  //     if (response.ok) {
  //       const blogs = await response.json();
  //       const currentBlog = blogs.find((b: BlogData) => b._id === blogId);
  //       if (currentBlog) {
  //         setBlog(currentBlog);
  //       } else {
  //         router.push("/my-blogs");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching blog:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchBlog = async (blogId: string) => {
    try {
      const { data: blogs } = await axios.get(`/api/my-blogs`);
      const currentBlog = blogs.find((b: BlogData) => b._id === blogId);

      if (currentBlog) {
        setBlog(currentBlog);
      } else {
        router.push("/my-blogs");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };
  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setUploading(true);
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setBlog((prev) => (prev ? { ...prev, imageUrl: data.url } : null));
  //       toast({
  //         title: "Success",
  //         description: "Image uploaded successfully",
  //       });
  //     } else {
  //       const data = await response.json();
  //       throw new Error(data.error || "Failed to upload image");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     toast({
  //       title: "Error",
  //       description:
  //         error instanceof Error ? error.message : "Failed to upload image",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);

      setBlog((prev) => (prev ? { ...prev, imageUrl: data.url } : null));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!blog) return;

  //   setSaving(true);
  //   try {
  //     const response = await fetch(`/api/blogs/${blog._id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title: blog.title,
  //         content: blog.content,
  //         imageUrl: blog.imageUrl,
  //       }),
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: "Success",
  //         description: "Blog updated successfully",
  //       });
  //       router.push("/my-blogs");
  //       router.refresh();
  //     } else {
  //       const data = await response.json();
  //       toast({
  //         title: "Error",
  //         description: data.error || "Failed to update blog",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating blog:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to update blog",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setSaving(true);
    try {
      await axios.put(`/api/blogs/${blog._id}`, {
        title: blog.title,
        content: blog.content,
        imageUrl: blog.imageUrl,
      });

      toast({
        title: "Success",
        description: "Blog updated successfully",
      });

      router.push("/my-blogs");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />
  }

  if (!blog) {
    return <div className="container mt-8">Blog not found</div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
        {/* <CardHeader>
          
          
        </CardHeader> */}
        {/* <span className="text-2xl font-bold text-zinc-100">Edit the Post</span> */}
        <CardTitle className="text-2xl font-bold text-zinc-100">
          Edit the Post
        </CardTitle>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-200">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-zinc-200">
                Image
              </Label>
              <div className="flex flex-col gap-4">
                {blog.imageUrl && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt="Blog preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-zinc-700 bg-zinc-800 hover:bg-zinc-700/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
                      ) : (
                        <>
                          <ImagePlus className="w-12 h-12 mb-3 text-zinc-400" />
                          <p className="mb-2 text-sm text-zinc-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-zinc-500">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-zinc-200">
                Content
              </Label>
              <Textarea
                id="content"
                value={blog.content}
                placeholder="Write your content here..."
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                rows={10}
                required
                className="min-h-[200px] bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={() => router.push("/my-blogs")}
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                type="submit"
                disabled={saving || uploading}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
