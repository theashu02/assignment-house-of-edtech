import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/my-blogs", "/blogs", "/dashboard"];

const authPaths = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const response = NextResponse.redirect(new URL("/signup", request.url));
    return response;
  }

  if (token && authPaths.some((path) => pathname === path)) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }

  if (!token && pathname === "/") {
    const response = NextResponse.redirect(new URL("/signup", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 