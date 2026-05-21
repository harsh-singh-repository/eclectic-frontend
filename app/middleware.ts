import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 🔓 Public routes
  const publicRoutes = ["/", "/login", "/register"];

  // 🔒 Admin routes
  const adminRoutes = ["/admin"];

  // 🔒 Protected routes (logged-in users)
  const protectedRoutes = ["/admin", "/profile"];

  // ✅ 1. If route is public → allow
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ❌ 2. Not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔐 3. Admin route protection
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // 🔐 4. Protected routes (any logged-in user)
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}