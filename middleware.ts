import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const publicPaths = [
  "/api/auth/login",
  "/api/auth/signup",
  "/auth-background.png",
  "/auth-background.webp",
  "/_next",
  "/favicon.ico",
];

const authPages = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicPaths.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("session")?.value;

  let isAuthenticated = false;
  if (sessionToken) {
    isAuthenticated = await isValidToken(sessionToken);
  }

  if (isAuthenticated) {
    if (authPages.includes(path)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated && path.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    return !!payload;
  } catch (error: any) {
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
