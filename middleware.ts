"use server";

import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authRoutes } from "./modules/auth/auth.routes";

export async function middleware(req: NextApiRequest) {

  // COMMENTED OUT FOR TESTING - AUTH BYPASS
  // const token = await getSessionData();

  // if ((req.url as string).endsWith(authRoutes.login)) {
  //   if (token) {
  //     return NextResponse.redirect(new URL("/admin", req.url));
  //   }
  //   return NextResponse.next();
  // }

  // if (!token) {
  //   const url = new URL(authRoutes.login, req.url);
  //   url.searchParams.set("callbackUrl", encodeURI(req.url || ""));
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export async function getSessionData() {
  const sessionData = cookies().get('transit-portal-accessToken')?.value;
  return sessionData;
}

export const config = {
  matcher: ["/admin/:path*"],
};
