"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "../common/LoadingSpinner";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function BlogDetails() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const { query } = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (query.id) {
      fetchBlogDetails(query.id as string);
    }
  }, [query.id]);

  const fetchBlogDetails = async (id: string) => {
    try {
      const response = await axios.get(`/api/blog/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog details",
        variant: "destructive",
      });
    }
  };

  if (!blog) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-200 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
          <span className="inline-flex items-center gap-1">
            {blog.author.name}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1">
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        {blog.imageUrl && (
          <div className="relative w-full h-96 mb-6">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-zinc-100 leading-relaxed">{blog.content}</p>
        <Button
          variant="ghost"
          className="mt-4 text-zinc-50 hover:text-zinc-200"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
} 