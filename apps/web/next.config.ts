import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders: NextConfig["headers"] = () => [
	{
		// Apply to all routes (including matched pages, not just static assets)
		source: "/:path*",
		headers: [
			// Content-Security-Policy — allow self + Vercel/CDN origins.
			// Expand `scriptSrc` once third-party scripts (analytics, fonts) are added.
			{
				key: "Content-Security-Policy",
				value: [
					"default-src 'self'",
					"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
					"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
					"font-src 'self' https://fonts.gstatic.com",
					"img-src 'self' data: https: blob:",
					"connect-src 'self' https://vercel.com https://*.vercel.app ws://localhost:*",
					"frame-ancestors 'none'",
					"base-uri 'self'",
					"form-action 'self'",
				].join("; "),
			},
			// HSTS — tell browsers to always use HTTPS for 1 year
			{
				key: "Strict-Transport-Security",
				value: "max-age=63072000; includeSubDomains; preload",
			},
		],
	},
];

const nextConfig: NextConfig = {
	// Produce a minimal self-contained server at `.next/standalone/` so the
	// production Docker image doesn't need node_modules — only the server.js,
	// .next/static, and public/ are copied into the runner.
	output: "standalone",
	// Security headers (CSP + HSTS; X-Frame-Options / X-Content-Type-Options /
	// Referrer-Policy / Permissions-Policy are handled in middleware.ts because
	// middleware can add them to redirect responses too.)
	...(isProd ? { headers: securityHeaders } : {}),
};

export default nextConfig;
