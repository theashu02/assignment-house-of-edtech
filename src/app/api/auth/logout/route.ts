import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  
  // Remove the token cookie
  cookieStore.delete("token");

  return NextResponse.json({ message: "Logged out successfully" });
} 