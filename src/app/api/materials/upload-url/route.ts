import type { NextRequest } from 'next/server';
import { MATERIALS_BUCKET, safeFileName, validateFileMeta } from '@/lib/materials/config';
import { fail, ok, requireStaff } from '@/lib/materials/server';

export const dynamic = 'force-dynamic';

// POST /api/materials/upload-url (staff)
// Files can be bigger than a serverless request body allows, so the browser uploads straight to
// Supabase Storage using a one-time signed token that only this route (after the admin check) can make.
export async function POST(req: NextRequest) {
  const gate = await requireStaff(req);
  if (!gate.ok) return gate.response;

  let body: { file_name?: unknown; file_size?: unknown; semester?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const check = validateFileMeta(body.file_name, body.file_size);
  if (!check.ok) return fail(400, check.error);

  const semester = Number(body.semester);
  const folder = Number.isInteger(semester) && semester >= 1 && semester <= 8 ? String(semester) : '1';
  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(String(body.file_name))}`;

  const { data, error } = await gate.admin.storage.from(MATERIALS_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return fail(500, 'Could not start the upload. Is the "study-materials" bucket created?');

  return ok({ path, token: data.token });
}
