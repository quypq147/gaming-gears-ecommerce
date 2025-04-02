import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;

  // Redirect to sign-in if no token is found
  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  try {
    // Validate the JWT with Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      // If the token is invalid or expired, redirect to sign-in
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const user = await response.json();

    if (!user.id) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const url = req.nextUrl;

    // Redirect users based on role
    if (url.pathname.startsWith("/admin") && user.role.name !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (url.pathname.startsWith("/staff") && !["staff", "admin"].includes(user.role.name)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};


