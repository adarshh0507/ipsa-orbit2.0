// Edit this file to change the text and images on the front page.
// To use real photos: put the files in /public/founders and /public/screens,
// then update the `image` paths below (for example '/founders/adarsh.jpg').

export interface Founder {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
}

export interface Feature {
  title: string;
  body: string;
  points: string[];
  image: string;
  imageAlt: string;
}

export const founders: Founder[] = [
  {
    name: 'Adarsh',
    role: 'Co-founder',
    bio: 'Co-founder of IPSA ORBIT. Add one or two lines here about what you do and why you started it.',
    image: '/founders/founder-1.svg',
    imageAlt: 'Portrait of Adarsh, co-founder of IPSA ORBIT',
  },
  {
    name: 'Co-founder name',
    role: 'Co-founder',
    bio: 'Add one or two lines here about what your co-founder does and why they started IPSA ORBIT.',
    image: '/founders/founder-2.svg',
    imageAlt: 'Portrait of the second co-founder of IPSA ORBIT',
  },
];

export const features: Feature[] = [
  {
    title: 'Notes and slides, sorted by subject',
    body:
      'Lecture notes, PPT slides, previous year papers with solved answers and practical files are grouped by subject and faculty. Open the subject, download the file, done.',
    points: [
      'Filter by LA, OMP, EG, PPS or BCE',
      'PDF and PPT files from your own faculty',
      'Previous year questions with answers',
    ],
    image: '/screens/notes.svg',
    imageAlt: 'The Notes page listing PDF and PPT files with subject filters',
  },
  {
    title: 'A timetable that stays current',
    body:
      'A clean weekly view shows the room or lab for every class. Admins update it once and every student sees the new week.',
    points: [
      'Separate schedules for DS-1 and DS-2',
      'Room numbers and lab locations in every slot',
      'Past weeks stay in the archive',
    ],
    image: '/screens/timetable.svg',
    imageAlt: 'The weekly timetable with colour-coded classes and room names',
  },
  {
    title: 'Ask ORBIT AI instead of scrolling',
    body:
      'ORBIT AI answers from your section’s own timetable, notes and notices, and shows which source it used.',
    points: [
      'Find a room, a faculty member or a deadline',
      'Get the right file in one message',
      'Every answer lists its source',
    ],
    image: '/screens/orbit-ai.svg',
    imageAlt: 'A chat with ORBIT AI answering a timetable question and finding a notes file',
  },
];

export const alsoInside = [
  { title: 'Assignments', body: 'Deadlines and submissions in one list.' },
  { title: 'Faculty directory', body: 'Cabins and office hours for every subject.' },
  { title: 'Official notices', body: 'Exam and department alerts from the college.' },
];

export const about = {
  heading: 'Why we built IPSA ORBIT',
  paragraphs: [
    'Finding the right note, room number or deadline used to mean digging through WhatsApp groups. Files got buried, timetables changed without anyone noticing, and every class had its own version of the truth.',
    'IPSA ORBIT puts all of it in one app, organised by section and subject, and kept up to date by the people who run the course.',
  ],
  facts: [
    { label: 'Built for', value: 'First-year B.Tech Data Science' },
    { label: 'College', value: 'IPS Academy, Indore' },
    { label: 'Sections', value: 'DS-1 and DS-2' },
  ],
};
