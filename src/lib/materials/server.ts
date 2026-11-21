// Server-only helpers for the Study Materials API. Never import this from a client component:
// it reads the secret SUPABASE_SERVICE_ROLE_KEY.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, makeAdminToken } from '@/lib/adminAuth';
import { MATERIALS_BUCKET, STORAGE_PATH_RE } from '@/lib/materials/config';

export type Caller =
  | { role: 'staff' } // signed in through the admin / faculty login
  | { role: 'student'; userId: string; email: string | null }; // signed in with a real Supabase account

let cached: SupabaseClient | null = null;

// Service-role client (bypasses RLS). Only used after the caller has been checked.
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('mock-ipsa-orbit')) return null;
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return cached;
}

export function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function ok(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export const NOT_CONFIGURED =
  'Storage is not connected yet. Add SUPABASE_SERVICE_ROLE_KEY in Vercel and run supabase/study_materials.sql.';

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function isStaff(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;
  return sameString(cookie, await makeAdminToken());
}

// Who is calling? Admin/faculty cookie first, then a Supabase student access token.
export async function identify(req: NextRequest, admin: SupabaseClient): Promise<Caller | null> {
  if (await isStaff(req)) return { role: 'staff' };

  const header = req.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return { role: 'student', userId: data.user.id, email: data.user.email ?? null };
}

// Browsers send an Origin header on writes. If it is another site, refuse.
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get('x-forwarded-host') || req.headers.get('host'));
  } catch {
    return false;
  }
}

export type Gate =
  | { ok: true; admin: SupabaseClient; caller: Caller }
  | { ok: false; response: NextResponse };

// For routes that any signed-in person may use (students read, staff read).
export async function requireSignedIn(req: NextRequest): Promise<Gate> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, response: fail(503, NOT_CONFIGURED) };
  const caller = await identify(req, admin);
  if (!caller) return { ok: false, response: fail(401, 'Please sign in to view study materials.') };
  return { ok: true, admin, caller };
}

// For routes that change data: admin / faculty only.
export async function requireStaff(req: NextRequest): Promise<Gate> {
  const admin = getAdminClient();
  if (!admin) return { ok: false, response: fail(503, NOT_CONFIGURED) };
  if (!sameOrigin(req)) return { ok: false, response: fail(403, 'Blocked: request came from another site.') };
  const caller = await identify(req, admin);
  if (!caller) return { ok: false, response: fail(401, 'Please sign in.') };
  if (caller.role !== 'staff') return { ok: false, response: fail(403, 'Only admins and faculty can do this.') };
  return { ok: true, admin, caller };
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Confirms an uploaded object really exists in the bucket and returns its real size / type.
export async function inspectObject(
  admin: SupabaseClient,
  path: string
): Promise<{ size: number; mime: string | null } | null> {
  if (!STORAGE_PATH_RE.test(path)) return null;
  const slash = path.indexOf('/');
  const folder = path.slice(0, slash);
  const name = path.slice(slash + 1);

  const { data, error } = await admin.storage.from(MATERIALS_BUCKET).list(folder, { limit: 5, search: name });
  if (error || !data) return null;
  const hit = data.find((o) => o.name === name);
  if (!hit) return null;

  const meta = (hit.metadata ?? {}) as { size?: number; mimetype?: string };
  return { size: Number(meta.size) || 0, mime: meta.mimetype ?? null };
}

export async function removeObject(admin: SupabaseClient, path: string) {
  if (!STORAGE_PATH_RE.test(path)) return;
  await admin.storage.from(MATERIALS_BUCKET).remove([path]);
}
