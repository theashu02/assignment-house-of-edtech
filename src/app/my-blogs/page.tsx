"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "../common/LoadingSpinner";
import { Clock, User, ChevronRight } from "lucide-react";
import { RightArrow } from "@/icons/arrow";
import axios from "axios"

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
  imageUrl?: string;
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const { data } = await axios.get("/api/my-blogs");
      console.log("Fetched blogs:", data);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await axios.delete(`/api/my-blogs`, { params: { id: blogId } });

      // Remove the deleted blog from the state
      setBlogs(blogs.filter((blog) => blog._id !== blogId));

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (blogId: string) => {
    router.push(`/blogs/edit/${blogId}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Button variant="outline" size="icon" onClick={() => router.push("/")} className="mt-[15%] md:mt-2 absolute">
          <ChevronLeft />
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold w-full text-center sm:text-left">
            My Blogs
          </h1>

          <div className="flex justify-center sm:justify-end items-center gap-3 w-full">
            {/* <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
            </Button> */}
            <Button
              className="text-[16px] w-fit leading-[20px] mt-2 bg-[#4c0519] hover:bg-gray-800 text-white px-4 py-6 rounded-[36px]"
              onClick={() => router.push("/dashboard")}
            >
              Create Blog
              <span className="bg-white rounded-full aspect-square w-[30px] h-[30px] flex items-center justify-center ml-2">
                <RightArrow />
              </span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            <AnimatePresence>
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-full"
                >
                  <article className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-[1.02] h-full">
                    {blog.imageUrl ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              blog.imageUrl
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/90 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">
                          No image available
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4 text-gray-400">
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          <span className="text-sm">{blog.author.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span className="text-sm">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                        {blog.title}
                      </h2>

                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {blog.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <Button
                          className="text-[16px] w-fit leading-[20px] mt-2 bg-[#4c0519] hover:bg-gray-800 text-white px-4 py-6 rounded-[36px]"
                          onClick={() => handleEdit(blog._id)}
                        >
                          Edit
                          <span className="bg-white rounded-full aspect-square w-[30px] h-[30px] flex items-center justify-center ml-2">
                            <RightArrow />
                          </span>
                        </Button>
                        <Button
                          className="text-[16px] w-fit leading-[20px] mt-2 bg-[#4c0519] hover:bg-gray-800 text-white px-4 py-6 rounded-[36px]"
                          onClick={() => handleDelete(blog._id)}
                        >
                          Delete
                          <span className="bg-white rounded-full aspect-square w-[30px] h-[30px] flex items-center justify-center ml-2">
                            <RightArrow />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
