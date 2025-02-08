"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  X,
  Image as ImageIcon,
  Loader2,
  Calendar,
  UserCircle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { RightArrow } from "@/icons/arrow";
interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);


  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        console.log(data.url);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        content,
        imageUrl,
      };

      const response = await fetch(
        editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs",
        {
          method: editingBlog ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save blog");
      }

      setTitle("");
      setContent("");
      setImageUrl("");
      setEditingBlog(null);
      setIsModalOpen(false);
      fetchBlogs();

      toast({
        title: "Success",
        description: editingBlog
          ? "Blog updated successfully"
          : "Blog created successfully",
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      fetchBlogs();
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
        >
          <ChevronLeft />
        </Button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-200">Blog Dashboard</h1>
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <PlusCircle size={20} />
            <span>Create Post</span>
          </button> */}
          <Button
            className="text-[16px] w-fit leading-[20px] mt-2 bg-[#4c0519] hover:bg-gray-800 text-white px-4 py-6 rounded-[36px]"
            onClick={() => setIsModalOpen(true)}
          >
            Create Blog
            <span className="bg-white rounded-full aspect-square w-[30px] h-[30px] flex items-center justify-center ml-2">
              <RightArrow />
            </span>
          </Button>
        </div>

        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-2xl bg-zinc-900 border border-zinc-800 text-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-300">
                  Create New Post
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Share your thoughts with the world. Add a title, image, and
                  content to create your post.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900"
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-200">Image</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => document.getElementById("image")?.click()}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ImageIcon className="h-4 w-4 mr-2" />
                      )}
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {imageUrl && (
                    <div className="mt-4 relative w-[40%] aspect-video rounded-lg overflow-hidden border border-zinc-700">
                      <Image
                        src={imageUrl}
                        alt="Blog image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-zinc-200">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900 min-h-[150px]"
                    placeholder="Write your post content..."
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Publish Post
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="group bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden"
              >
                {blog.imageUrl && (
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-zinc-100 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <UserCircle className="h-4 w-4" />
                        {blog.author.name}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-400 line-clamp-3 text-sm leading-relaxed">
                    {blog.content}
                  </p>
                  {/* <div className="pt-2">
                    <Button
                      variant="ghost"
                      className="text-zinc-50 hover:text-zinc-200 -ml-4 text-sm bg-slate-600 hover:bg-slate-500"
                      onClick={() => window.location.href = `/blog/${blog._id}`}
                    >
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blog posts yet. Create your first post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
