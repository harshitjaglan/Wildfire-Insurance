import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/dashboard", "/rooms/:path*", "/items/:path*", "/privacy"],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers to protect against common web vulnerabilities
  response.headers.set("X-Frame-Options", "DENY"); // Prevents clickjacking attacks
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevents MIME type sniffing
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); // Controls referrer information
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains" // Forces HTTPS connections
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    // Prevents XSS attacks by controlling resource loading
  );

  return response;
}
