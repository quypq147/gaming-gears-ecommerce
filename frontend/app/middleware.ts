import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((req) => {
  const { userId, sessionClaims } = getAuth(req);
  const url = req.nextUrl;

  // ✅ Redirect to sign-in page if user is not logged in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ Get user role from Clerk's session (ensure safe access)
  const role = sessionClaims?.publicMetadata?.role as string | undefined; 

  // 🔥 Ensure 'role' exists before checking permissions
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url)); // If no role, deny access
  }

  // 🔒 Restrict access based on role
  if (url.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admins
  }

  if (url.pathname.startsWith("/staff") && !["staff", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/", req.url)); // Only staff and admins can access
  }

  return NextResponse.next();
});

// 🔥 Apply middleware to specific paths only
export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"], // Protect these paths
};

