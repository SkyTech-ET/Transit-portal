import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { authRoutes } from "./modules/auth/auth.routes";

// next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "am"],
  defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
  // Handle i18n routing first
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Check session
  const token = await getSessionData();

  // Force locale redirect
  const authPaths = [
    authRoutes.login,
    authRoutes.signup,
    authRoutes.forgot_password,
  ];
  const pathname = req.nextUrl.pathname;

  // If the path is without locale, redirect to /en/auth/login
  if (authPaths.some((path) => pathname === path)) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${authRoutes.login}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export async function getSessionData() {
  return cookies().get("transit-portal-accessToken")?.value;
}

// Matcher
export const config = {
  matcher: ["/", "/(en|am)/:path*", "/admin/:path*", "/auth/:path*"],
};
