import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import Blog from '@/models/Blog';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, imageUrl } = body;

    await connectDB();

    const blog = await Blog.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(params.id),
        author: new mongoose.Types.ObjectId(userId)
      },
      {
        title,
        content,
        imageUrl
      },
      { new: true }
    ).populate('author', 'name email');

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyAuth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const blog = await Blog.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(params.id),
      author: new mongoose.Types.ObjectId(userId)
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
} 