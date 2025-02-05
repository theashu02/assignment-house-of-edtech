import { NextResponse } from "next/server";
import {verifyAuth} from "../../../lib/auth";
import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const userId = await verifyAuth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await connectDB();
    
    const blogs = await db
      .collection("blogs")
      .aggregate([
        {
          $match: { authorId: new ObjectId(userId) }
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author"
          }
        },
        {
          $unwind: "$author"
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            createdAt: 1,
            "author.name": 1,
            "author.email": 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();

    return NextResponse.json(blogs);
  } catch (error) {
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

    const { db } = await connectDB();
    
    const blog = await db.collection("blogs").findOne({
      _id: new ObjectId(blogId)
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    if (blog.authorId.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this blog" },
        { status: 403 }
      );
    }

    await db.collection("blogs").deleteOne({
      _id: new ObjectId(blogId)
    });

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 