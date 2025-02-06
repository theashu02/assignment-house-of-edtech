import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import Blog from "@/models/Blog";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    const userId = await verifyAuth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Add imageUrl to the select statement
    const blogs = await Blog.find({ 
      author: new mongoose.Types.ObjectId(userId) 
    })
    .populate({
      path: 'author',
      select: 'name email'
    })
    .select('title content createdAt imageUrl author')
    .sort({ createdAt: -1 })
    .lean();

    // Transform the data to match the frontend interface
    const transformedBlogs = blogs.map((blog: any) => ({
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      createdAt: blog.createdAt.toISOString(),
      author: {
        name: blog.author.name,
        email: blog.author.email,
      },
    }));

    console.log("Transformed blogs:", transformedBlogs);

    return NextResponse.json(transformedBlogs);
  } catch (error) {
    console.error("Error in GET /api/my-blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await verifyAuth();
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findOne({
      _id: new mongoose.Types.ObjectId(blogId),
      author: new mongoose.Types.ObjectId(userId)
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      );
    }

    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/my-blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 