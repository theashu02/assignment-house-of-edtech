import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { verifyAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await verifyAuth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, imageUrl } = body;

    await connectDB();

    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      author: new mongoose.Types.ObjectId(userId)
    });

    // Populate the author details
    await blog.populate('author', 'name email');

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
} 