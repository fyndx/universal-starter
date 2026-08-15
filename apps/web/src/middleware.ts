import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------------
// Applied to every response (pages, API, redirects, streamed).
// Content-Security-Policy is omitted here — define it in next.config.ts
// `headers.security` so it can use the CDN origin. The headers below are
// safe to apply unconditionally.
const SECURITY_HEADERS = {
	// Prevent browsers from sniffing the MIME type — stops XSS via asset upload
	"X-Content-Type-Options": "nosniff",
	// Prevent the page from being rendered in iframes — mitigates clickjacking
	"X-Frame-Options": "SAMEORIGIN",
	// Control what information is sent in the Referer header
	"Referrer-Policy": "strict-origin-when-cross-origin",
	// Disable unused browser features via Permissions-Policy
	"Permissions-Policy":
		"camera=(), microphone=(), geolocation=(), interest-cohort=()",
	// Opt into DNS prefetching for domains we link to (reduces latency)
	"X-DNS-Prefetch-Control": "on",
} as const;

function setSecurityHeaders(res: NextResponse): NextResponse {
	// The headers property is live — mutations propagate to the outgoing response
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		res.headers.set(key, value);
	}
	return res;
}

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------
/**
 * Cookie-presence check — runs before any page renders on the Edge runtime.
 *
 * This is a FAST guard, not full session validation. Actual session validation
 * happens client-side (authClient.useSession in layouts) and on the API
 * (withAuth/requireAuth guards). The guard's sole job is to prevent the
 * "flash of unauthenticated content" on protected routes and the "flash of
 * auth pages" when the user is already logged in.
 *
 * Cookie prefix comes from the better-auth config: `universal-starter`.
 */
const SESSION_COOKIE = "universal-starter.session_token";

const PROTECTED_PATHS = ["/home", "/explore", "/admin"];
const AUTH_PATHS = ["/auth"];

function isProtected(pathname: string): boolean {
	return PROTECTED_PATHS.some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);
}

function isAuthRoute(pathname: string): boolean {
	return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

	// Protected route without session cookie -> redirect to auth
	if (isProtected(pathname) && !hasSession) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth";
		url.searchParams.set("redirect", pathname);
		return setSecurityHeaders(NextResponse.redirect(url));
	}

	// Auth route with session cookie -> redirect to home (prevent flash)
	if (isAuthRoute(pathname) && hasSession) {
		const url = request.nextUrl.clone();
		const redirect = url.searchParams.get("redirect");
		url.pathname = redirect ?? "/home";
		url.searchParams.delete("redirect");
		return setSecurityHeaders(NextResponse.redirect(url));
	}

	return setSecurityHeaders(NextResponse.next());
}

export const config = {
	// Only run on routes that need auth decisions — skip static assets,
	// API routes, and _next internals.
	matcher: ["/home/:path*", "/explore/:path*", "/admin/:path*", "/auth/:path*"],
};
