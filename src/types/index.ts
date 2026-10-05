export type UserRole = 'student' | 'admin';
export type Section = 'DS-1' | 'DS-2';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  section: Section;
  enrollment_no?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  short_name: string;
  credits: number;
  semester: number;
  department: string;
  color: string;
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  cabin: string;
  office_hours: string;
  avatar_url?: string;
}

export interface FacultyMapping {
  id: string;
  subject_id: string;
  faculty_id: string;
  section: Section;
  lab_faculty_id?: string;
}

export type ResourceType =
  | 'pdf_notes'
  | 'ppt'
  | 'doc'
  | 'excel'
  | 'image'
  | 'reference_link'
  | 'pyq'
  | 'practical_file';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  faculty_id: string;
  section: Section | 'Both';
  resource_type: ResourceType;
  file_url: string;
  file_name: string;
  file_size?: string;
  file_ext: string;
  download_count: number;
  is_published: boolean;
  created_at: string;
  unit_or_module?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type SlotType = 'lecture' | 'lab' | 'tutorial';

export interface TimetableWeek {
  id: string;
  section: Section;
  week_number: number;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  status: 'draft' | 'published';
  created_at: string;
}

export interface TimetableSlot {
  id: string;
  week_id: string;
  section: Section;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm format, e.g. "09:30"
  end_time: string;   // HH:mm format, e.g. "10:30"
  subject_id: string;
  faculty_id: string;
  room: string;
  slot_type: SlotType;
}

export type Priority = 'normal' | 'high' | 'urgent';

export interface Assignment {
  id: string;
  title: string;
  subject_id: string;
  faculty_id: string;
  section: Section | 'Both';
  description: string;
  due_date: string; // ISO string
  attachment_url?: string;
  attachment_name?: string;
  priority: Priority;
  is_published: boolean;
  max_marks?: number;
  created_at: string;
}

export interface StudentAssignment {
  id: string;
  assignment_id: string;
  student_id: string;
  status: 'pending' | 'submitted';
  submitted_at?: string;
  notes?: string;
  file_url?: string;
}

export type AnnouncementCategory =
  | 'general'
  | 'class_update'
  | 'exam'
  | 'assignment_reminder'
  | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  description: string;
  date: string;
  target_section: Section | 'Both';
  priority: Priority;
  attachment_url?: string;
  attachment_name?: string;
  is_pinned: boolean;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  section: Section | 'Both';
  subject_id?: string;
  source_file_name?: string;
  file_type?: string;
  extracted_text: string;
  is_published: boolean;
  upload_date: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface KnowledgeChunk {
  id: string;
  document_id: string;
  content: string;
  keywords: string[];
  source_title: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: {
    type: 'note' | 'timetable' | 'faculty' | 'assignment' | 'announcement' | 'knowledge';
    title: string;
    details?: string;
    link?: string;
  }[];
  isFallback?: boolean;
}

export interface ChatbotLog {
  id: string;
  user_id?: string;
  user_role?: UserRole;
  section?: Section;
  query: string;
  response: string;
  sources: string[];
  matched_score: number;
  was_fallback: boolean;
  created_at: string;
}
