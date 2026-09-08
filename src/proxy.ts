import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const parsed = await decrypt(session);
      if (!parsed) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin/login") && session) {
    try {
      const parsed = await decrypt(session);
      if (parsed) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch (e) {
      // invalid token, let them login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
