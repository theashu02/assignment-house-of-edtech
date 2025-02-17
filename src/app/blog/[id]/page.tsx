// 'use client'
import React from "react";
import Image from "next/image";
import BackButton from "@/components/BackButton";
import { getBlogById } from "@/app/actions";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <p className="text-gray-200 text-xl">Blog post not found</p>
      </div>
    );
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
