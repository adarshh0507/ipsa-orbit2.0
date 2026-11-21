import type { NextRequest } from 'next/server';
import { MATERIALS_BUCKET, kindOf } from '@/lib/materials/config';
import { UUID_RE, fail, ok, requireSignedIn } from '@/lib/materials/server';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /api/materials/:id/file?mode=view|download
// Returns a short-lived signed link. The storage bucket is private, so this is the only way to open a file.
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return fail(400, 'Invalid id.');

  const gate = await requireSignedIn(req);
  if (!gate.ok) return gate.response;

  const { data: row, error } = await gate.admin
    .from('study_materials')
    .select('id,file_path,file_name,file_ext,is_published')
    .eq('id', id)
    .maybeSingle();
  if (error) return fail(500, 'Could not open the file.');
  // Students never learn that an unpublished file exists.
  if (!row || (!row.is_published && gate.caller.role !== 'staff')) return fail(404, 'Material not found.');

  const download = req.nextUrl.searchParams.get('mode') === 'download';
  const { data: signed, error: signError } = await gate.admin.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(row.file_path as string, 300, download ? { download: row.file_name as string } : undefined);
  if (signError || !signed) return fail(404, 'The file is missing from storage.');

  if (download && gate.caller.role === 'student') {
    await gate.admin.rpc('bump_material_downloads', { material_id: id }); // best effort
  }

  return ok({
    url: signed.signedUrl,
    file_name: row.file_name,
    preview: kindOf(row.file_ext as string)?.previewable ?? null,
  });
}
