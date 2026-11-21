// Shared (browser + server) settings and checks for the Study Materials portal.

export const MATERIALS_BUCKET = 'study-materials';
export const MAX_FILE_BYTES = 50 * 1024 * 1024; // keep in sync with supabase/study_materials.sql

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const BRANCHES = [
  'Data Science',
  'Computer Science',
  'Information Technology',
  'AI & Machine Learning',
  'Electronics & Communication',
  'Electrical',
  'Mechanical',
  'Civil',
  'All Branches (Common)',
] as const;

// Subjects offered as suggestions in the upload form (people can still type any other subject).
export const SUGGESTED_SUBJECTS = [
  'Linear Algebra',
  'Optics & Modern Physics',
  'Engineering Graphics',
  'Basic Civil Engineering',
  'Basic Electronics Engineering',
  'Programming for Problem Solving',
  'Electronics & Computer Workshop',
];

export interface FileKind {
  ext: string;
  label: string;
  group: 'pdf' | 'slides' | 'doc' | 'sheet' | 'image' | 'archive' | 'text';
  mime: string;
  previewable: 'pdf' | 'image' | null;
}

const KINDS: FileKind[] = [
  { ext: 'pdf', label: 'PDF', group: 'pdf', mime: 'application/pdf', previewable: 'pdf' },
  { ext: 'ppt', label: 'PPT', group: 'slides', mime: 'application/vnd.ms-powerpoint', previewable: null },
  { ext: 'pptx', label: 'PPT', group: 'slides', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', previewable: null },
  { ext: 'doc', label: 'DOC', group: 'doc', mime: 'application/msword', previewable: null },
  { ext: 'docx', label: 'DOC', group: 'doc', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', previewable: null },
  { ext: 'xls', label: 'Excel', group: 'sheet', mime: 'application/vnd.ms-excel', previewable: null },
  { ext: 'xlsx', label: 'Excel', group: 'sheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', previewable: null },
  { ext: 'csv', label: 'CSV', group: 'sheet', mime: 'text/csv', previewable: null },
  { ext: 'txt', label: 'Text', group: 'text', mime: 'text/plain', previewable: null },
  { ext: 'zip', label: 'ZIP', group: 'archive', mime: 'application/zip', previewable: null },
  { ext: 'png', label: 'Image', group: 'image', mime: 'image/png', previewable: 'image' },
  { ext: 'jpg', label: 'Image', group: 'image', mime: 'image/jpeg', previewable: 'image' },
  { ext: 'jpeg', label: 'Image', group: 'image', mime: 'image/jpeg', previewable: 'image' },
  { ext: 'webp', label: 'Image', group: 'image', mime: 'image/webp', previewable: 'image' },
  { ext: 'gif', label: 'Image', group: 'image', mime: 'image/gif', previewable: 'image' },
];

export const ACCEPT_ATTR = KINDS.map((k) => `.${k.ext}`).join(',');

export function extOf(fileName: string): string {
  const i = fileName.lastIndexOf('.');
  return i < 0 ? '' : fileName.slice(i + 1).toLowerCase();
}

export function kindOf(fileNameOrExt: string): FileKind | null {
  const ext = fileNameOrExt.includes('.') ? extOf(fileNameOrExt) : fileNameOrExt.toLowerCase();
  return KINDS.find((k) => k.ext === ext) ?? null;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 1) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// What the API sends to the browser (never includes the storage path).
export interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  semester: number;
  branch: string;
  file_name: string;
  file_ext: string;
  file_size: number;
  mime_type: string | null;
  is_published: boolean;
  uploaded_by: string | null;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export const PUBLIC_COLUMNS =
  'id,title,description,subject,semester,branch,file_name,file_ext,file_size,mime_type,is_published,uploaded_by,download_count,created_at,updated_at';

export interface MaterialInput {
  title: string;
  description: string | null;
  subject: string;
  semester: number;
  branch: string;
  is_published: boolean;
  uploaded_by: string | null;
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

// Validates the text fields coming from the form. Returns an error message or the clean values.
export function parseMaterialInput(raw: unknown): { ok: true; value: MaterialInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid request.' };
  const r = raw as Record<string, unknown>;

  const title = clean(r.title, 200);
  const subject = clean(r.subject, 120);
  const branch = clean(r.branch, 80);
  const semester = Number(r.semester);
  const description = clean(r.description, 2000);
  const uploadedBy = clean(r.uploaded_by, 80);

  if (!title) return { ok: false, error: 'Please enter a title.' };
  if (!subject) return { ok: false, error: 'Please choose or type a subject.' };
  if (!branch) return { ok: false, error: 'Please choose a branch.' };
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) return { ok: false, error: 'Semester must be between 1 and 8.' };

  return {
    ok: true,
    value: {
      title,
      description: description || null,
      subject,
      semester,
      branch,
      is_published: r.is_published === undefined ? true : r.is_published === true,
      uploaded_by: uploadedBy || null,
    },
  };
}

// Storage object paths are made by the server as "<semester>/<uuid>-<safe-name>".
export const STORAGE_PATH_RE = /^[1-8]\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[A-Za-z0-9._-]{1,120}$/;

export function safeFileName(name: string): string {
  const ext = extOf(name);
  const base = name.slice(0, name.length - (ext ? ext.length + 1 : 0));
  const slug = base
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80);
  return `${slug || 'file'}.${ext}`;
}

export function validateFileMeta(fileName: unknown, size: unknown): { ok: true; ext: string; size: number } | { ok: false; error: string } {
  if (typeof fileName !== 'string' || !fileName.trim()) return { ok: false, error: 'File name is missing.' };
  const kind = kindOf(fileName);
  if (!kind) return { ok: false, error: 'This file type is not allowed. Use PDF, PPT, DOC, Excel, CSV, TXT, ZIP or an image.' };
  const n = Number(size);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, error: 'The file looks empty.' };
  if (n > MAX_FILE_BYTES) return { ok: false, error: `File is too large. The limit is ${formatBytes(MAX_FILE_BYTES)}.` };
  return { ok: true, ext: kind.ext, size: n };
}
