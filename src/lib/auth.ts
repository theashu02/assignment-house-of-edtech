import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { User } from "./models/user";

interface User {
    User : any;
}
const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400, // 24 hours
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  try {
    const session = await decrypt(token.value);
    return session as User;
  } catch (e) {
    return null;
  }
}
