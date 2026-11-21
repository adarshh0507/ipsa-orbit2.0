import type { NextRequest } from 'next/server';
import {
  PUBLIC_COLUMNS,
  extOf,
  kindOf,
  parseMaterialInput,
  validateFileMeta,
  STORAGE_PATH_RE,
} from '@/lib/materials/config';
import { fail, inspectObject, ok, removeObject, requireSignedIn, requireStaff } from '@/lib/materials/server';

export const dynamic = 'force-dynamic';

// GET /api/materials            -> published materials (students and staff)
// GET /api/materials?scope=all  -> everything incl. drafts (staff only)
export async function GET(req: NextRequest) {
  const gate = await requireSignedIn(req);
  if (!gate.ok) return gate.response;

  const wantAll = req.nextUrl.searchParams.get('scope') === 'all';
  if (wantAll && gate.caller.role !== 'staff') return fail(403, 'Only admins and faculty can see drafts.');

  let query = gate.admin
    .from('study_materials')
    .select(PUBLIC_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(2000);
  if (!wantAll) query = query.eq('is_published', true);

  const { data, error } = await query;
  if (error) return fail(500, 'Could not load study materials. Did you run supabase/study_materials.sql?');
  return ok({ materials: data ?? [], role: gate.caller.role });
}

// POST /api/materials  (staff) - saves the details of a file that was just uploaded with a signed token.
export async function POST(req: NextRequest) {
  const gate = await requireStaff(req);
  if (!gate.ok) return gate.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const parsed = parseMaterialInput(body);
  if (!parsed.ok) return fail(400, parsed.error);

  const path = typeof body.path === 'string' ? body.path : '';
  const fileName = typeof body.file_name === 'string' ? body.file_name.slice(0, 200) : '';
  if (!STORAGE_PATH_RE.test(path)) return fail(400, 'Upload reference is invalid.');
  const fileCheck = validateFileMeta(fileName, 1);
  if (!fileCheck.ok) return fail(400, fileCheck.error);

  const object = await inspectObject(gate.admin, path);
  if (!object) return fail(400, 'The file was not found in storage. Please upload it again.');
  const size = validateFileMeta(fileName, object.size || 1);
  if (!size.ok) {
    await removeObject(gate.admin, path);
    return fail(400, size.error);
  }
  if (extOf(path) !== fileCheck.ext) return fail(400, 'File type does not match the upload.');

  const { data, error } = await gate.admin
    .from('study_materials')
    .insert({
      ...parsed.value,
      file_path: path,
      file_name: fileName,
      file_ext: fileCheck.ext,
      file_size: object.size,
      mime_type: object.mime ?? kindOf(fileCheck.ext)?.mime ?? null,
    })
    .select(PUBLIC_COLUMNS)
    .single();

  if (error) {
    await removeObject(gate.admin, path);
    return fail(500, 'Could not save the material details.');
  }
  return ok({ material: data }, 201);
}
