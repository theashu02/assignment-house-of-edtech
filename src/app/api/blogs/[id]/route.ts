import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };
    const { title, content } = await req.json();

    await connectDB();
    
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to edit this blog' },
        { status: 403 }
      );
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { userId: string };

    await connectDB();
    
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.author.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this blog' },
        { status: 403 }
      );
    }

    await blog.deleteOne();

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting blog' },
      { status: 500 }
    );
  }
} 