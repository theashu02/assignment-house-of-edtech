// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import connectDB from '@/lib/db';
// import User from '@/models/User';

// const JWT_SECRET = process.env.JWT_SECRET!;

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();
    
//     await connectDB();
    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 400 }
//       );
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     const response = NextResponse.json(
//       { message: 'Login successful' },
//       { status: 200 }
//     );

//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 60 * 60 * 24 * 7 // 7 days
//     });

//     return response;
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Error logging in' },
//       { status: 500 }
//     );
//   }
// } 

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = await createToken(user._id.toString());

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}