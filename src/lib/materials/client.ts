'use client';

// Browser-side helpers that talk to /api/materials. Admin / faculty are recognised by their login
// cookie (sent automatically); students are recognised by their Supabase access token.

import { supabase } from '@/lib/supabase';
import { MATERIALS_BUCKET, type StudyMaterial } from '@/lib/materials/config';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      cache: 'no-store',
      headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(await authHeaders()), ...init.headers },
    });
  } catch {
    throw new ApiError(0, 'Network problem. Check your internet and try again.');
  }

  let json: { ok?: boolean; error?: string } & Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    // not JSON
  }
  if (!res.ok || json.ok === false) {
    throw new ApiError(res.status, json.error || 'Something went wrong. Please try again.');
  }
  return json as T;
}

export async function fetchMaterials(scope: 'published' | 'all' = 'published'): Promise<StudyMaterial[]> {
  const json = await call<{ materials: StudyMaterial[] }>(`/api/materials${scope === 'all' ? '?scope=all' : ''}`);
  return json.materials;
}

export interface FileLink {
  url: string;
  file_name: string;
  preview: 'pdf' | 'image' | null;
}

export function fetchFileLink(id: string, mode: 'view' | 'download'): Promise<FileLink> {
  return call<FileLink & { ok: true }>(`/api/materials/${id}/file?mode=${mode}`);
}

// Asks the server for a link, then starts the browser download (the page itself does not navigate away).
export async function downloadMaterial(id: string): Promise<void> {
  const link = await fetchFileLink(id, 'download');
  const a = document.createElement('a');
  a.href = link.url;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ----- admin / faculty only (the server rejects anyone else) -----

export interface MaterialFields {
  title: string;
  description: string;
  subject: string;
  semester: number;
  branch: string;
  is_published: boolean;
  uploaded_by: string;
}

// Uploads the file straight to private storage using a one-time signed token.
async function uploadFile(file: File, semester: number): Promise<string> {
  const start = await call<{ path: string; token: string }>('/api/materials/upload-url', {
    method: 'POST',
    body: JSON.stringify({ file_name: file.name, file_size: file.size, semester }),
  });
  const { error } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .uploadToSignedUrl(start.path, start.token, file, { contentType: file.type || undefined });
  if (error) throw new ApiError(502, 'The file could not be uploaded. Please try again.');
  return start.path;
}

export async function createMaterial(fields: MaterialFields, file: File): Promise<StudyMaterial> {
  const path = await uploadFile(file, fields.semester);
  const json = await call<{ material: StudyMaterial }>('/api/materials', {
    method: 'POST',
    body: JSON.stringify({ ...fields, path, file_name: file.name }),
  });
  return json.material;
}

export async function updateMaterial(id: string, fields: MaterialFields, replacement?: File | null): Promise<StudyMaterial> {
  const extra: Record<string, string> = {};
  if (replacement) {
    extra.path = await uploadFile(replacement, fields.semester);
    extra.file_name = replacement.name;
  }
  const json = await call<{ material: StudyMaterial }>(`/api/materials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...fields, ...extra }),
  });
  return json.material;
}

export async function setPublished(id: string, is_published: boolean): Promise<StudyMaterial> {
  const json = await call<{ material: StudyMaterial }>(`/api/materials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_published }),
  });
  return json.material;
}

export async function deleteMaterial(id: string): Promise<void> {
  await call(`/api/materials/${id}`, { method: 'DELETE' });
}
