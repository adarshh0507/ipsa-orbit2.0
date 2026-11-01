import {
  UserProfile,
  Subject,
  Faculty,
  FacultyMapping,
  Resource,
  TimetableWeek,
  TimetableSlot,
  Assignment,
  StudentAssignment,
  Announcement,
  KnowledgeDocument,
  KnowledgeChunk,
  ChatbotLog,
  Section
} from '@/types';

// Initial Subjects according to IPS Academy syllabus
export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-la',
    code: 'DS-101',
    name: 'Linear Algebra',
    short_name: 'LA',
    credits: 4,
    semester: 1,
    department: 'Applied Mathematics',
    color: '#38bdf8' // Cyan
  },
  {
    id: 'sub-omp',
    code: 'DS-102',
    name: 'Optics & Modern Physics',
    short_name: 'OMP',
    credits: 4,
    semester: 1,
    department: 'Applied Physics',
    color: '#818cf8' // Indigo
  },
  {
    id: 'sub-eg',
    code: 'DS-103',
    name: 'Engineering Graphics',
    short_name: 'EG',
    credits: 3,
    semester: 1,
    department: 'Mechanical Engineering',
    color: '#c084fc' // Purple
  },
  {
    id: 'sub-bce',
    code: 'DS-104',
    name: 'Basic Civil Engineering',
    short_name: 'BCE',
    credits: 3,
    semester: 1,
    department: 'Civil Engineering',
    color: '#34d399' // Emerald
  },
  {
    id: 'sub-bee',
    code: 'DS-105',
    name: 'Basic Electronics Engineering',
    short_name: 'Basic Electronics',
    credits: 3,
    semester: 1,
    department: 'Electronics & Communication',
    color: '#fbbf24' // Amber
  },
  {
    id: 'sub-pps',
    code: 'DS-106',
    name: 'Programming for Problem Solving',
    short_name: 'PPS',
    credits: 4,
    semester: 1,
    department: 'Data Science & CSE',
    color: '#22d3ee' // Electric Cyan
  },
  {
    id: 'sub-dt',
    code: 'DS-107',
    name: 'Design Thinking',
    short_name: 'Design Thinking',
    credits: 2,
    semester: 1,
    department: 'Humanities & Innovation',
    color: '#f472b6' // Pink
  }
];

// Initial Faculty for IPS Academy Indore
export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-reena-joshi',
    name: 'Dr. Reena Joshi',
    title: 'Professor & Head',
    department: 'Applied Mathematics',
    email: 'reena.joshi@orbit.ipsacademy.ac.in',
    cabin: 'Academic Block A - Room 304',
    office_hours: 'Mon, Wed, Fri: 2:00 PM - 3:30 PM',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-kavita-soni',
    name: 'Dr. Kavita Soni',
    title: 'Associate Professor',
    department: 'Applied Physics',
    email: 'kavita.soni@orbit.ipsacademy.ac.in',
    cabin: 'Science Wing - Room 112',
    office_hours: 'Tue, Thu: 11:30 AM - 1:00 PM',
    avatar_url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-shivendra-tiwari',
    name: 'Dr. Shivendra Tiwari',
    title: 'Associate Professor',
    department: 'Applied Physics',
    email: 'shivendra.tiwari@orbit.ipsacademy.ac.in',
    cabin: 'Science Wing - Room 114',
    office_hours: 'Mon, Thu: 3:00 PM - 4:30 PM',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-amit-chandak',
    name: 'Mr. Amit Chandak',
    title: 'Assistant Professor',
    department: 'Mechanical Engineering',
    email: 'amit.chandak@orbit.ipsacademy.ac.in',
    cabin: 'Mechanical Block - Room 202',
    office_hours: 'Mon-Fri: 1:30 PM - 2:30 PM',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-devaanshi-jagwani',
    name: 'Dr. Devaanshi Jagwani',
    title: 'Assistant Professor',
    department: 'Civil Engineering & Design',
    email: 'devaanshi.jagwani@orbit.ipsacademy.ac.in',
    cabin: 'Civil Block - Room 108',
    office_hours: 'Tue, Wed: 2:00 PM - 4:00 PM',
    avatar_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-sandeep-rangi',
    name: 'Dr. Sandeep Rangi',
    title: 'Associate Professor',
    department: 'Electronics & Communication',
    email: 'sandeep.rangi@orbit.ipsacademy.ac.in',
    cabin: 'EC Block - Room 215',
    office_hours: 'Wed, Fri: 11:00 AM - 12:30 PM',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-amit-shrivastava',
    name: 'Mr. Amit Shrivastava',
    title: 'Assistant Professor & Lab In-charge',
    department: 'Data Science & Computer Engineering',
    email: 'amit.shrivastava@orbit.ipsacademy.ac.in',
    cabin: 'Computing Center - Room 401',
    office_hours: 'Mon, Tue, Thu: 3:30 PM - 5:00 PM',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fac-lalitesh-sinha',
    name: 'Mr. Lalitesh Sinha',
    title: 'Assistant Professor',
    department: 'Innovation & Design Cell',
    email: 'lalitesh.sinha@orbit.ipsacademy.ac.in',
    cabin: 'Innovation Lab - Block C',
    office_hours: 'Tue, Fri: 1:00 PM - 3:00 PM',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
  }
];

// Initial Faculty Subject Mapping based on prompt specifications
export const INITIAL_FACULTY_MAPPINGS: FacultyMapping[] = [
  // DS-1 Mappings
  { id: 'fm-1', subject_id: 'sub-la', faculty_id: 'fac-reena-joshi', section: 'DS-1' },
  { id: 'fm-2', subject_id: 'sub-omp', faculty_id: 'fac-kavita-soni', section: 'DS-1' },
  { id: 'fm-3', subject_id: 'sub-eg', faculty_id: 'fac-amit-chandak', section: 'DS-1' },
  { id: 'fm-4', subject_id: 'sub-bce', faculty_id: 'fac-devaanshi-jagwani', section: 'DS-1' },
  { id: 'fm-5', subject_id: 'sub-bee', faculty_id: 'fac-sandeep-rangi', section: 'DS-1' },
  { id: 'fm-6', subject_id: 'sub-pps', faculty_id: 'fac-amit-shrivastava', section: 'DS-1' },
  { id: 'fm-7', subject_id: 'sub-dt', faculty_id: 'fac-devaanshi-jagwani', section: 'DS-1' },

  // DS-2 Mappings
  { id: 'fm-8', subject_id: 'sub-la', faculty_id: 'fac-reena-joshi', section: 'DS-2' },
  { id: 'fm-9', subject_id: 'sub-omp', faculty_id: 'fac-shivendra-tiwari', section: 'DS-2' },
  { id: 'fm-10', subject_id: 'sub-eg', faculty_id: 'fac-amit-chandak', section: 'DS-2' },
  { id: 'fm-11', subject_id: 'sub-bce', faculty_id: 'fac-devaanshi-jagwani', section: 'DS-2' },
  { id: 'fm-12', subject_id: 'sub-bee', faculty_id: 'fac-sandeep-rangi', section: 'DS-2' },
  { id: 'fm-13', subject_id: 'sub-pps', faculty_id: 'fac-amit-shrivastava', section: 'DS-2' },
  { id: 'fm-14', subject_id: 'sub-dt', faculty_id: 'fac-lalitesh-sinha', section: 'DS-2' },
];

export const INITIAL_LABS = [
  { name: 'OMP Lab (Optics & Modern Physics)', location: 'Science Block Lab 2', faculty: 'Dr. Kavita Soni / Dr. Shivendra Tiwari' },
  { name: 'EG Lab (Engineering Graphics & CAD)', location: 'Mechanical CAD Center Lab 1', faculty: 'Mr. Amit Chandak' },
  { name: 'BCE Lab (Basic Civil Engineering)', location: 'Civil Testing Yard & Survey Lab', faculty: 'Dr. Devaanshi Jagwani' },
  { name: 'PPS Lab (Programming for Problem Solving)', location: 'Turing Computer Lab 3', faculty: 'Mr. Amit Shrivastava' },
  { name: 'Electronics and Computer Workshop', location: 'EC Core Workshop Block', faculty: 'Dr. Sandeep Rangi' }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-pps-mod1',
    title: 'PPS Unit 1: Introduction to Algorithms, Flowcharts and C Fundamentals',
    description: 'Comprehensive notes covering pseudo-code, memory representations, data types, operators, and control structures.',
    subject_id: 'sub-pps',
    faculty_id: 'fac-amit-shrivastava',
    section: 'Both',
    resource_type: 'pdf_notes',
    file_url: '#',
    file_name: 'PPS_Unit_1_Algorithms_C_Basics.pdf',
    file_size: '3.4 MB',
    file_ext: 'pdf',
    download_count: 142,
    is_published: true,
    created_at: '2026-09-15T10:00:00Z',
    unit_or_module: 'Unit 1'
  },
  {
    id: 'res-la-matrices',
    title: 'Linear Algebra: Eigenvalues, Eigenvectors and Matrix Diagonalization',
    description: 'Lecture slides and solved problems for Cayley-Hamilton theorem and quadratic forms.',
    subject_id: 'sub-la',
    faculty_id: 'fac-reena-joshi',
    section: 'Both',
    resource_type: 'pdf_notes',
    file_url: '#',
    file_name: 'LA_Module2_Eigenvalues_Diagonalization.pdf',
    file_size: '4.8 MB',
    file_ext: 'pdf',
    download_count: 198,
    is_published: true,
    created_at: '2026-09-18T14:30:00Z',
    unit_or_module: 'Unit 2'
  },
  {
    id: 'res-omp-laser',
    title: 'OMP: Lasers, Fiber Optics and Quantum Wave Mechanics',
    description: 'Detailed derivations of Einstein coefficients, He-Ne laser construction, and numerical aperture calculations.',
    subject_id: 'sub-omp',
    faculty_id: 'fac-kavita-soni',
    section: 'DS-1',
    resource_type: 'pdf_notes',
    file_url: '#',
    file_name: 'OMP_Lasers_and_WaveMechanics_Notes.pdf',
    file_size: '5.2 MB',
    file_ext: 'pdf',
    download_count: 87,
    is_published: true,
    created_at: '2026-09-20T09:15:00Z',
    unit_or_module: 'Unit 3'
  },
  {
    id: 'res-eg-sheets',
    title: 'Engineering Graphics: Orthographic Projections & Isometric Views Sheets',
    description: 'Step-by-step drawing guidelines with standard IPS Academy drawing sheet layouts and dimensioning rules.',
    subject_id: 'sub-eg',
    faculty_id: 'fac-amit-chandak',
    section: 'Both',
    resource_type: 'practical_file',
    file_url: '#',
    file_name: 'EG_Sheet_Guidelines_Projections.pdf',
    file_size: '8.1 MB',
    file_ext: 'pdf',
    download_count: 231,
    is_published: true,
    created_at: '2026-09-12T16:00:00Z',
    unit_or_module: 'Practical Sheets'
  },
  {
    id: 'res-pps-pyq',
    title: 'PPS Mid-Semester Previous 5 Years Question Papers with Solutions',
    description: 'Compiled previous year question bank with official evaluation scheme and code solutions.',
    subject_id: 'sub-pps',
    faculty_id: 'fac-amit-shrivastava',
    section: 'Both',
    resource_type: 'pyq',
    file_url: '#',
    file_name: 'PPS_PYQ_Solved_2021_2025.pdf',
    file_size: '6.5 MB',
    file_ext: 'pdf',
    download_count: 310,
    is_published: true,
    created_at: '2026-09-22T11:00:00Z',
    unit_or_module: 'PYQ Bank'
  },
  {
    id: 'res-bce-surveying',
    title: 'Basic Civil: Surveying and Building Materials Reference Slides',
    description: 'PPT presentation on leveling, total station basics, and cement concrete mix standards.',
    subject_id: 'sub-bce',
    faculty_id: 'fac-devaanshi-jagwani',
    section: 'Both',
    resource_type: 'ppt',
    file_url: '#',
    file_name: 'BCE_Surveying_Materials_Lecture.pptx',
    file_size: '12.4 MB',
    file_ext: 'ppt',
    download_count: 115,
    is_published: true,
    created_at: '2026-09-19T13:45:00Z',
    unit_or_module: 'Unit 2'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-pps-pointers',
    title: 'Assignment 2: Pointer Arithmetic, Arrays and Dynamic Memory Allocation',
    subject_id: 'sub-pps',
    faculty_id: 'fac-amit-shrivastava',
    section: 'Both',
    description: 'Implement a memory-efficient matrix multiplication program using pointers. Submit clean C code (.c) with time complexity analysis and screenshot test cases.',
    due_date: '2026-10-05T23:59:00Z',
    priority: 'high',
    is_published: true,
    max_marks: 20,
    attachment_name: 'PPS_Assignment_2_Problem_Statement.pdf',
    created_at: '2026-09-25T08:00:00Z'
  },
  {
    id: 'asg-la-vectors',
    title: 'Assignment 1: Vector Spaces, Subspaces and Linear Transformations',
    subject_id: 'sub-la',
    faculty_id: 'fac-reena-joshi',
    section: 'Both',
    description: 'Solve the 10 marked theoretical problems from Chapter 3 on Basis, Dimension, and Rank-Nullity theorem.',
    due_date: '2026-10-02T17:00:00Z',
    priority: 'urgent',
    is_published: true,
    max_marks: 15,
    attachment_name: 'LA_Assignment_Problem_Set_1.pdf',
    created_at: '2026-09-23T10:00:00Z'
  },
  {
    id: 'asg-eg-isometric',
    title: 'EG Sheet No. 4: Isometric Projection of Truncated Cone and Hexagonal Prism',
    subject_id: 'sub-eg',
    faculty_id: 'fac-amit-chandak',
    section: 'DS-1',
    description: 'Complete the drawing sheet using first-angle projection on imperial sheet with standard title block.',
    due_date: '2026-10-08T12:00:00Z',
    priority: 'normal',
    is_published: true,
    max_marks: 25,
    attachment_name: 'EG_Sheet4_Specifications.pdf',
    created_at: '2026-09-26T14:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Semester Examination Schedule for 1st Year B.Tech Data Science',
    category: 'exam',
    description: 'The first mid-semester examination for DS-1 and DS-2 will commence from October 14th. Detailed syllabus breakdown and seating plans will be released soon.',
    date: '2026-09-28',
    target_section: 'Both',
    priority: 'urgent',
    is_pinned: true,
    created_at: '2026-09-28T09:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'PPS Lab Batch A & B Grouping for Practical Evaluations',
    category: 'class_update',
    description: 'Please check your designated system numbers in Turing Lab 3. Practical assessment files must be signed before Friday.',
    date: '2026-09-27',
    target_section: 'Both',
    priority: 'high',
    is_pinned: false,
    created_at: '2026-09-27T11:30:00Z'
  },
  {
    id: 'ann-3',
    title: 'Design Thinking Ideation Workshop & Project Mentorship',
    category: 'general',
    description: 'A special design sprint session by industry innovators will be conducted this Saturday from 10:00 AM in the Auditorium.',
    date: '2026-09-26',
    target_section: 'Both',
    priority: 'normal',
    is_pinned: false,
    created_at: '2026-09-26T15:00:00Z'
  }
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'kdoc-1',
    title: 'IPS Academy First Year Data Science Academic Policy & Attendance Criteria',
    category: 'Academic Regulations',
    section: 'Both',
    extracted_text: `Minimum 75% attendance is compulsory to appear in university mid-semester and end-semester examinations. Medical leaves must be submitted within 7 days to the First Year Coordinator. 
Marks Distribution:
Internal assessment: 40 marks (Two mid-sems: 20 marks, Assignments & Quizzes: 10 marks, Attendance & Conduct: 10 marks).
End-Semester Theory: 60 marks.
Practical Labs: 50 marks (Continuous evaluation: 30 marks, External viva & experiment: 20 marks).`,
    is_published: true,
    upload_date: '2026-09-10'
  },
  {
    id: 'kdoc-2',
    title: 'Turing Computer Lab & PPS Guidelines',
    category: 'Lab Rules',
    section: 'Both',
    extracted_text: `PPS Lab is held in Turing Computer Lab 3. Linux/GCC environment is utilized for C programming. Students must carry their lab journals with verified program outputs. Lab instructor: Mr. Amit Shrivastava. Lab assistant: Mr. Rajesh Sharma.`,
    is_published: true,
    upload_date: '2026-09-12'
  },
  {
    id: 'kdoc-3',
    title: 'Faculty Cabin Directory & Consultation Hours',
    category: 'Faculty Directory',
    section: 'Both',
    extracted_text: `Dr. Reena Joshi (Linear Algebra): Block A - Room 304.
Dr. Kavita Soni (OMP DS-1): Science Wing - Room 112.
Dr. Shivendra Tiwari (OMP DS-2): Science Wing - Room 114.
Mr. Amit Chandak (Engineering Graphics): Mechanical Block - Room 202.
Dr. Devaanshi Jagwani (BCE / Design Thinking DS-1): Civil Block - Room 108.
Dr. Sandeep Rangi (Basic Electronics): EC Block - Room 215.
Mr. Amit Shrivastava (PPS): Computing Center - Room 401.
Mr. Lalitesh Sinha (Design Thinking DS-2): Innovation Lab - Block C.`,
    is_published: true,
    upload_date: '2026-09-14'
  }
];

// Helper to load or initialize from localStorage
class OrbitStore {
  private subjects: Subject[] = INITIAL_SUBJECTS;
  private faculty: Faculty[] = INITIAL_FACULTY;
  private facultyMappings: FacultyMapping[] = INITIAL_FACULTY_MAPPINGS;
  private resources: Resource[] = INITIAL_RESOURCES;
  // Prompt requirement: "Timetable must start blank and be created by the admin. Initially show: 'No timetable published yet.'"
  private timetableWeeks: TimetableWeek[] = [];
  private timetableSlots: TimetableSlot[] = [];
  private assignments: Assignment[] = INITIAL_ASSIGNMENTS;
  private studentAssignments: StudentAssignment[] = [];
  private announcements: Announcement[] = INITIAL_ANNOUNCEMENTS;
  private knowledgeDocs: KnowledgeDocument[] = INITIAL_KNOWLEDGE_DOCS;
  private chatbotLogs: ChatbotLog[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('ipsa_orbit_data_v1');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.subjects) this.subjects = data.subjects;
        if (data.faculty) this.faculty = data.faculty;
        if (data.facultyMappings) this.facultyMappings = data.facultyMappings;
        if (data.resources) this.resources = data.resources;
        if (data.timetableWeeks) this.timetableWeeks = data.timetableWeeks;
        if (data.timetableSlots) this.timetableSlots = data.timetableSlots;
        if (data.assignments) this.assignments = data.assignments;
        if (data.studentAssignments) this.studentAssignments = data.studentAssignments;
        if (data.announcements) this.announcements = data.announcements;
        if (data.knowledgeDocs) this.knowledgeDocs = data.knowledgeDocs;
        if (data.chatbotLogs) this.chatbotLogs = data.chatbotLogs;
      }
      this.initialized = true;
    } catch {
      this.initialized = true;
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          subjects: this.subjects,
          faculty: this.faculty,
          facultyMappings: this.facultyMappings,
          resources: this.resources,
          timetableWeeks: this.timetableWeeks,
          timetableSlots: this.timetableSlots,
          assignments: this.assignments,
          studentAssignments: this.studentAssignments,
          announcements: this.announcements,
          knowledgeDocs: this.knowledgeDocs,
          chatbotLogs: this.chatbotLogs
        };
        localStorage.setItem('ipsa_orbit_data_v1', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getSubjects() { return [...this.subjects]; }
  public getFaculty() { return [...this.faculty]; }
  public getFacultyMappings() { return [...this.facultyMappings]; }
  public getResources() { return [...this.resources]; }
  public getTimetableWeeks() { return [...this.timetableWeeks]; }
  public getTimetableSlots() { return [...this.timetableSlots]; }
  public getAssignments() { return [...this.assignments]; }
  public getStudentAssignments() { return [...this.studentAssignments]; }
  public getAnnouncements() { return [...this.announcements]; }
  public getKnowledgeDocs() { return [...this.knowledgeDocs]; }
  public getChatbotLogs() { return [...this.chatbotLogs]; }

  // Subject & Faculty methods
  public updateFaculty(updated: Faculty) {
    this.faculty = this.faculty.map(f => f.id === updated.id ? updated : f);
    this.saveToStorage();
  }

  public addFaculty(newFac: Omit<Faculty, 'id'>) {
    const id = `fac-${Date.now()}`;
    const fac: Faculty = { ...newFac, id };
    this.faculty.push(fac);
    this.saveToStorage();
    return fac;
  }

  public updateFacultyMapping(section: Section, subjectId: string, facultyId: string) {
    const existing = this.facultyMappings.find(m => m.section === section && m.subject_id === subjectId);
    if (existing) {
      existing.faculty_id = facultyId;
    } else {
      this.facultyMappings.push({
        id: `fm-${Date.now()}`,
        section,
        subject_id: subjectId,
        faculty_id: facultyId
      });
    }
    this.saveToStorage();
  }

  // Resource methods
  public addResource(resource: Omit<Resource, 'id' | 'created_at' | 'download_count'>) {
    const newRes: Resource = {
      ...resource,
      id: `res-${Date.now()}`,
      created_at: new Date().toISOString(),
      download_count: 0
    };
    this.resources.unshift(newRes);
    this.saveToStorage();
    return newRes;
  }

  public updateResource(updated: Resource) {
    this.resources = this.resources.map(r => r.id === updated.id ? updated : r);
    this.saveToStorage();
  }

  public deleteResource(id: string) {
    this.resources = this.resources.filter(r => r.id !== id);
    this.saveToStorage();
  }

  public incrementDownload(id: string) {
    const res = this.resources.find(r => r.id === id);
    if (res) {
      res.download_count += 1;
      this.saveToStorage();
    }
  }

  // Timetable methods - CRITICAL NEXT WEEK WORKFLOW
  public createTimetableWeek(section: Section, weekNumber: number, startDate: string, endDate: string, status: 'draft' | 'published' = 'draft'): TimetableWeek {
    const weekId = `week-${section}-${weekNumber}-${Date.now()}`;
    const newWeek: TimetableWeek = {
      id: weekId,
      section,
      week_number: weekNumber,
      start_date: startDate,
      end_date: endDate,
      status,
      created_at: new Date().toISOString()
    };
    this.timetableWeeks.push(newWeek);
    this.saveToStorage();
    return newWeek;
  }

  public publishTimetableWeek(weekId: string) {
    const week = this.timetableWeeks.find(w => w.id === weekId);
    if (week) {
      week.status = 'published';
      this.saveToStorage();
    }
  }

  public addTimetableSlot(slot: Omit<TimetableSlot, 'id'>): TimetableSlot {
    const newSlot: TimetableSlot = {
      ...slot,
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    this.timetableSlots.push(newSlot);
    this.saveToStorage();
    return newSlot;
  }

  public updateTimetableSlot(updated: TimetableSlot) {
    this.timetableSlots = this.timetableSlots.map(s => s.id === updated.id ? updated : s);
    this.saveToStorage();
  }

  public deleteTimetableSlot(id: string) {
    this.timetableSlots = this.timetableSlots.filter(s => s.id !== id);
    this.saveToStorage();
  }

  // Copy timetable for Next Week Workflow
  public copyTimetableToNextWeek(sourceWeekId: string, targetWeekNumber: number, targetStartDate: string, targetEndDate: string): TimetableWeek {
    const sourceWeek = this.timetableWeeks.find(w => w.id === sourceWeekId);
    if (!sourceWeek) throw new Error('Source week not found');

    const newWeek = this.createTimetableWeek(
      sourceWeek.section,
      targetWeekNumber,
      targetStartDate,
      targetEndDate,
      'draft'
    );

    const sourceSlots = this.timetableSlots.filter(s => s.week_id === sourceWeekId);
    sourceSlots.forEach(s => {
      this.addTimetableSlot({
        week_id: newWeek.id,
        section: newWeek.section,
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        subject_id: s.subject_id,
        faculty_id: s.faculty_id,
        room: s.room,
        slot_type: s.slot_type
      });
    });

    this.saveToStorage();
    return newWeek;
  }

  // Assignment methods
  public addAssignment(assignment: Omit<Assignment, 'id' | 'created_at'>): Assignment {
    const newAsg: Assignment = {
      ...assignment,
      id: `asg-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.assignments.unshift(newAsg);
    this.saveToStorage();
    return newAsg;
  }

  public updateAssignment(updated: Assignment) {
    this.assignments = this.assignments.map(a => a.id === updated.id ? updated : a);
    this.saveToStorage();
  }

  public deleteAssignment(id: string) {
    this.assignments = this.assignments.filter(a => a.id !== id);
    this.saveToStorage();
  }

  public submitAssignment(assignmentId: string, studentId: string, notes?: string, fileUrl?: string) {
    const existing = this.studentAssignments.find(sa => sa.assignment_id === assignmentId && sa.student_id === studentId);
    if (existing) {
      existing.status = 'submitted';
      existing.submitted_at = new Date().toISOString();
      existing.notes = notes;
      existing.file_url = fileUrl;
    } else {
      this.studentAssignments.push({
        id: `sa-${Date.now()}`,
        assignment_id: assignmentId,
        student_id: studentId,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        notes,
        file_url: fileUrl
      });
    }
    this.saveToStorage();
  }

  // Announcement methods
  public addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.announcements.unshift(newAnn);
    this.saveToStorage();
    return newAnn;
  }

  public deleteAnnouncement(id: string) {
    this.announcements = this.announcements.filter(a => a.id !== id);
    this.saveToStorage();
  }

  // Knowledge base methods
  public addKnowledgeDoc(doc: Omit<KnowledgeDocument, 'id' | 'upload_date'>): KnowledgeDocument {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kdoc-${Date.now()}`,
      upload_date: new Date().toISOString().split('T')[0]
    };
    this.knowledgeDocs.unshift(newDoc);
    this.saveToStorage();
    return newDoc;
  }

  public updateKnowledgeDoc(updated: KnowledgeDocument) {
    this.knowledgeDocs = this.knowledgeDocs.map(k => k.id === updated.id ? updated : k);
    this.saveToStorage();
  }

  public deleteKnowledgeDoc(id: string) {
    this.knowledgeDocs = this.knowledgeDocs.filter(k => k.id !== id);
    this.saveToStorage();
  }

  // Log chatbot query
  public logChatbotQuery(log: Omit<ChatbotLog, 'id' | 'created_at'>) {
    const newLog: ChatbotLog = {
      ...log,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.chatbotLogs.unshift(newLog);
    this.saveToStorage();
  }

  // Pre-seed sample timetable for demonstration when requested by admin
  public seedSampleTimetable(section: Section) {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    const weekNumber = 1;
    const startDate = monday.toISOString().split('T')[0];
    const endDate = saturday.toISOString().split('T')[0];

    const week = this.createTimetableWeek(section, weekNumber, startDate, endDate, 'published');

    const facultyMap = this.facultyMappings.filter(m => m.section === section);
    const getFac = (subId: string) => facultyMap.find(m => m.subject_id === subId)?.faculty_id || 'fac-reena-joshi';

    // Monday
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Monday', start_time: '09:30', end_time: '10:30', subject_id: 'sub-la', faculty_id: getFac('sub-la'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Monday', start_time: '10:30', end_time: '11:30', subject_id: 'sub-omp', faculty_id: getFac('sub-omp'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Monday', start_time: '11:45', end_time: '13:45', subject_id: 'sub-pps', faculty_id: getFac('sub-pps'), room: 'Turing Lab 3', slot_type: 'lab' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Monday', start_time: '14:30', end_time: '15:30', subject_id: 'sub-bce', faculty_id: getFac('sub-bce'), room: 'Room 204', slot_type: 'lecture' });

    // Tuesday
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Tuesday', start_time: '09:30', end_time: '10:30', subject_id: 'sub-bee', faculty_id: getFac('sub-bee'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Tuesday', start_time: '10:30', end_time: '11:30', subject_id: 'sub-pps', faculty_id: getFac('sub-pps'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Tuesday', start_time: '11:45', end_time: '13:45', subject_id: 'sub-eg', faculty_id: getFac('sub-eg'), room: 'CAD Lab 1', slot_type: 'lab' });

    // Wednesday
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Wednesday', start_time: '09:30', end_time: '10:30', subject_id: 'sub-la', faculty_id: getFac('sub-la'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Wednesday', start_time: '10:30', end_time: '11:30', subject_id: 'sub-dt', faculty_id: getFac('sub-dt'), room: 'Innovation Lab', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Wednesday', start_time: '11:45', end_time: '13:45', subject_id: 'sub-omp', faculty_id: getFac('sub-omp'), room: 'Optics Lab 2', slot_type: 'lab' });

    // Thursday
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Thursday', start_time: '09:30', end_time: '10:30', subject_id: 'sub-omp', faculty_id: getFac('sub-omp'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Thursday', start_time: '10:30', end_time: '11:30', subject_id: 'sub-bee', faculty_id: getFac('sub-bee'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Thursday', start_time: '11:45', end_time: '12:45', subject_id: 'sub-pps', faculty_id: getFac('sub-pps'), room: 'Room 204', slot_type: 'lecture' });

    // Friday
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Friday', start_time: '09:30', end_time: '10:30', subject_id: 'sub-bce', faculty_id: getFac('sub-bce'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Friday', start_time: '10:30', end_time: '11:30', subject_id: 'sub-la', faculty_id: getFac('sub-la'), room: 'Room 204', slot_type: 'lecture' });
    this.addTimetableSlot({ week_id: week.id, section, day_of_week: 'Friday', start_time: '11:45', end_time: '13:45', subject_id: 'sub-bee', faculty_id: getFac('sub-bee'), room: 'Electronics Workshop', slot_type: 'lab' });

    return week;
  }
}

export const orbitStore = new OrbitStore();
