import {
  destroySession,
  getSession,
  isSessionExpired,
  shouldRefreshToken,
} from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { refreshSessionAction } from "./app/(auth)/actions";
import { handleCurionaError } from "./lib/error";

// Routes that don't require authentication
const publicRoutes = ["/", "/login/callback/google"];

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const signInURL = new URL("/", request.url);

  if (publicRoutes.includes(pathname)) {
    return response;
  }

  try {
    const session = await getSession(request);
    console.log("[MIDDLEWARE] Session in middleware:", session?.user.id);

    if (!session) {
      console.warn("[MIDDLEWARE] No session found, redirecting to sign-in");
      return NextResponse.redirect(signInURL);
    }

    if (session?.tokens && shouldRefreshToken(session, 5 * 60 * 1000)) {
      console.log("[MIDDLEWARE] Session needs refresh, refreshing now");
      const refreshResult = await refreshSessionAction();
      if (!refreshResult.success) {
        console.warn("[MIDDLEWARE] Refresh failed, redirecting to sign-in");
        return NextResponse.redirect(signInURL);
      }

      console.log("[MIDDLEWARE] Session refreshed successfully");
      return response;
    }

    if (isSessionExpired(session)) {
      console.warn("[MIDDLEWARE] Session expired, redirecting to sign-in");
      await destroySession(response);
      return NextResponse.redirect(signInURL);
    }
  } catch (error) {
    const err = handleCurionaError(error);
    console.error("[MIDDLEWARE] Error:", err);
    await destroySession(response);
    return NextResponse.redirect(signInURL);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
