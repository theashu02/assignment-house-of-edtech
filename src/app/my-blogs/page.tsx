"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
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

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
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
      const response = await fetch("/api/my-blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        throw new Error("Failed to fetch blogs");
      }
    } catch (error) {
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
      const response = await fetch(`/api/my-blogs?id=${blogId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted blog from the state
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
      } else {
        throw new Error("Failed to delete blog");
      }
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
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold w-full text-center sm:text-left">
          My Blogs
        </h1>
        <div className="flex justify-center sm:justify-end items-center gap-3 w-full">
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push("/blogs/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Blog
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            className="w-full sm:w-auto"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button> */}
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
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl mt-4">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      By {blog.author.name} on{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="mb-4 line-clamp-3 flex-grow">
                      {blog.content}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleEdit(blog._id)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>

    // <div className="container py-8">
    //   <h1 className="text-3xl font-bold mb-6">My Blogs</h1>
    //   {blogs.length === 0 ? (
    //     <p>You haven't created any blogs yet.</p>
    //   ) : (
    //     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    //       {blogs.map((blog) => (
    //         <Card key={blog._id}>
    //           <CardHeader>
    //             <CardTitle>{blog.title}</CardTitle>
    //             <CardDescription>
    //               By {blog.author.name} on{" "}
    //               {new Date(blog.createdAt).toLocaleDateString()}
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent>
    //             <p className="mb-4">
    //               {blog.content.length > 150
    //                 ? `${blog.content.substring(0, 150)}...`
    //                 : blog.content}
    //             </p>
    //             <div className="flex gap-2">
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 onClick={() => handleEdit(blog._id)}
    //               >
    //                 <Pencil className="h-4 w-4 mr-2" />
    //                 Edit
    //               </Button>
    //               <Button
    //                 variant="destructive"
    //                 size="sm"
    //                 onClick={() => handleDelete(blog._id)}
    //               >
    //                 <Trash2 className="h-4 w-4 mr-2" />
    //                 Delete
    //               </Button>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
}
