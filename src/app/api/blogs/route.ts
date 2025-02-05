import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().populate('author', 'name email');
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    
    const blog = await Blog.create({
      title,
      content,
      author: decoded.userId
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating blog' },
      { status: 500 }
    );
  }
} 