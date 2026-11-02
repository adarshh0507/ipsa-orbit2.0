import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  makeAdminToken,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    // empty body
  }

  if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Galat ID ya password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await makeAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 din login rahega
  });
  return res;
}

// Logout: /api/admin-login par DELETE bhejo
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
