
import React from "react";
import Blog from "@/models/Blog";
import connectDB from "@/lib/db";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { Loader2 } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const { id } = await params;
  const blog: BlogPost | null = await Blog.findById(id).populate("author");

  if (!blog) {
    return <Loader2 className="h-5 w-5" />;
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="pt-[3%] pl-[3%]">
        <BackButton />
      </div>
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
      </div>
    </div>
  );
}
