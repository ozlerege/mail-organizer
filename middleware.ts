import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// Add paths that don't require authentication
const publicPaths = [
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
];

// Add paths that require authentication
const protectedPaths = ["/dashboard"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to public paths
  if (publicPaths.some((p) => path.startsWith(p))) {
    // If user is already logged in and tries to access login/signup pages, redirect to dashboard
    if (
      (path === "/login" || path === "/signup") &&
      request.cookies.get("session")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected paths
  if (protectedPaths.some((p) => path.startsWith(p))) {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT
      verify(sessionToken, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect dashboard routes
    "/dashboard/:path*",
    // Protect auth pages from authenticated users
    "/login",
    "/signup",
  ],
};
