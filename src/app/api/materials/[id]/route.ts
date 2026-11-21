import type { NextRequest } from 'next/server';
import {
  PUBLIC_COLUMNS,
  STORAGE_PATH_RE,
  extOf,
  kindOf,
  parseMaterialInput,
  validateFileMeta,
} from '@/lib/materials/config';
import { UUID_RE, fail, inspectObject, ok, removeObject, requireStaff } from '@/lib/materials/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/materials/:id (staff)
//  - { is_published: boolean }                  -> publish / unpublish only
//  - { title, subject, ... }                    -> edit details
//  - { ..., path, file_name }                   -> edit details AND replace the file
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return fail(400, 'Invalid id.');

  const gate = await requireStaff(req);
  if (!gate.ok) return gate.response;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const { data: current, error: loadError } = await gate.admin
    .from('study_materials')
    .select('id,file_path')
    .eq('id', id)
    .maybeSingle();
  if (loadError) return fail(500, 'Could not load the material.');
  if (!current) return fail(404, 'Material not found.');

  let update: Record<string, unknown>;
  let newPath: string | null = null;

  const keys = Object.keys(body);
  if (keys.length === 1 && keys[0] === 'is_published') {
    if (typeof body.is_published !== 'boolean') return fail(400, 'Invalid request.');
    update = { is_published: body.is_published };
  } else {
    const parsed = parseMaterialInput(body);
    if (!parsed.ok) return fail(400, parsed.error);
    update = { ...parsed.value };

    if (typeof body.path === 'string' && body.path) {
      const path = body.path;
      const fileName = typeof body.file_name === 'string' ? body.file_name.slice(0, 200) : '';
      if (!STORAGE_PATH_RE.test(path) || path === current.file_path) return fail(400, 'Upload reference is invalid.');

      const fileCheck = validateFileMeta(fileName, 1);
      if (!fileCheck.ok) return fail(400, fileCheck.error);
      if (extOf(path) !== fileCheck.ext) return fail(400, 'File type does not match the upload.');

      const object = await inspectObject(gate.admin, path);
      if (!object) return fail(400, 'The new file was not found in storage. Please upload it again.');
      const sized = validateFileMeta(fileName, object.size || 1);
      if (!sized.ok) {
        await removeObject(gate.admin, path);
        return fail(400, sized.error);
      }

      newPath = path;
      update = {
        ...update,
        file_path: path,
        file_name: fileName,
        file_ext: fileCheck.ext,
        file_size: object.size,
        mime_type: object.mime ?? kindOf(fileCheck.ext)?.mime ?? null,
      };
    }
  }

  const { data, error } = await gate.admin
    .from('study_materials')
    .update(update)
    .eq('id', id)
    .select(PUBLIC_COLUMNS)
    .maybeSingle();

  if (error || !data) {
    if (newPath) await removeObject(gate.admin, newPath);
    return fail(500, 'Could not update the material.');
  }

  // The new file is saved; the old one is no longer needed.
  if (newPath) await removeObject(gate.admin, current.file_path as string);
  return ok({ material: data });
}

// DELETE /api/materials/:id (staff) - removes the details and the stored file.
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return fail(400, 'Invalid id.');

  const gate = await requireStaff(req);
  if (!gate.ok) return gate.response;

  const { data: row, error: loadError } = await gate.admin
    .from('study_materials')
    .select('id,file_path')
    .eq('id', id)
    .maybeSingle();
  if (loadError) return fail(500, 'Could not load the material.');
  if (!row) return fail(404, 'Material not found.');

  const { error } = await gate.admin.from('study_materials').delete().eq('id', id);
  if (error) return fail(500, 'Could not delete the material.');

  await removeObject(gate.admin, row.file_path as string);
  return ok();
}
