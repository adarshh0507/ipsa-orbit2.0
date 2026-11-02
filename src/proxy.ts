import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, makeAdminToken } from "@/lib/adminAuth";

// Next.js 16 mein "middleware" ka naam "proxy" ho gaya hai.
// /admin ya uske andar ka koi bhi page bina login ke nahi khulega.
export async function proxy(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = cookie && cookie === (await makeAdminToken());

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin-login";
    url.search = "";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
