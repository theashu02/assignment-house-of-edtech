'use server'

import Blog from "@/models/Blog";
import connectDB from "@/lib/db";
import { decodeId } from "@/lib/code";

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    const decodedId = decodeId(id);
    
    const blog = await Blog.findById(decodedId).populate("author");
    
    if (!blog) {
      return null;
    }

    return {
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: {
        name: blog.author.name,
      },
      createdAt: blog.createdAt,
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
} 