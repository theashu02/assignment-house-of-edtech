import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export async function verifyAuth(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Return the user ID from the token payload
    return payload.userId as string;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

export async function createToken(userId: string | ObjectId): Promise<string> {
  const { SignJWT } = await import('jose');
  
  // Convert ObjectId to string if needed
  const userIdString = userId instanceof ObjectId ? userId.toString() : userId;

  // Create a new JWT token
  const token = await new SignJWT({ userId: userIdString })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
} 