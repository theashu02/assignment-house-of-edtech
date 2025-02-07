import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import Blog from "@/models/Blog";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function PUT(request: Request) {
  try {
    const userId = await verifyAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, content } = body;

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findOne({
      _id: new mongoose.Types.ObjectId(id),
      author: new mongoose.Types.ObjectId(userId)
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    ).populate('author', 'name email');

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error in PUT /api/blogs/edit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 