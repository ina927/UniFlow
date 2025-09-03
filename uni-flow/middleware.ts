import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/app/lib/jwt";

export function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/home");
  if (isProtected) {
    const token = req.cookies.get("token")?.value;
    const claims = token ? verify(token) : null;
    if (!claims) {
      const url = new URL("/", req.url);
      url.searchParams.set("reason", "auth");
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/profile/:path*", "/home/:path*"] };