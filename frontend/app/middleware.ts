import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value || localStorage.getItem("jwt");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Validate the JWT with Strapi
  return fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((user) => {
      if (!user.id) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }

      const url = req.nextUrl;

      // Redirect users based on role
      if (url.pathname.startsWith("/admin") && user.role.name !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (url.pathname.startsWith("/staff") && !["staff", "admin"].includes(user.role.name)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    })
    .catch(() => NextResponse.redirect(new URL("/sign-in", req.url)));
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};


