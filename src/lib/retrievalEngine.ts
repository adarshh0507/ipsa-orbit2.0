import { orbitStore } from './store';
import { Section, ChatMessage } from '@/types';

interface RetrievalSource {
  type: 'note' | 'timetable' | 'faculty' | 'assignment' | 'announcement' | 'knowledge';
  title: string;
  details?: string;
  link?: string;
}

export interface RetrievalResult {
  answer: string;
  sources: RetrievalSource[];
  confidence: number;
  matchedEntities: string[];
  isFallback: boolean;
}

export function queryOrbitAI(rawQuery: string, section: Section = 'DS-1'): RetrievalResult {
  const query = rawQuery.toLowerCase().trim();
  const sources: RetrievalSource[] = [];
  const matchedEntities: string[] = [];

  // Data snapshots
  const subjects = orbitStore.getSubjects();
  const facultyList = orbitStore.getFaculty();
  const facultyMappings = orbitStore.getFacultyMappings();
  const resources = orbitStore.getResources().filter(r => r.is_published && (r.section === 'Both' || r.section === section));
  const timetableWeeks = orbitStore.getTimetableWeeks().filter(w => w.section === section && w.status === 'published');
  const timetableSlots = orbitStore.getTimetableSlots().filter(s => s.section === section);
  const assignments = orbitStore.getAssignments().filter(a => a.is_published && (a.section === 'Both' || a.section === section));
  const announcements = orbitStore.getAnnouncements().filter(a => a.target_section === 'Both' || a.target_section === section);
  const knowledgeDocs = orbitStore.getKnowledgeDocs().filter(k => k.is_published && (k.section === 'Both' || k.section === section));

  // Helper to find subject by code, name, or acronym
  const detectSubject = () => {
    for (const sub of subjects) {
      const short = sub.short_name.toLowerCase();
      const code = sub.code.toLowerCase();
      const name = sub.name.toLowerCase();
      if (
        query.includes(short) ||
        query.includes(code) ||
        query.includes(name) ||
        (short === 'pps' && query.includes('programming')) ||
        (short === 'la' && (query.includes('linear') || query.includes('algebra') || query.includes('matrix'))) ||
        (short === 'omp' && (query.includes('optics') || query.includes('physics'))) ||
        (short === 'eg' && (query.includes('graphics') || query.includes('drawing') || query.includes('isometric'))) ||
        (short === 'bce' && (query.includes('civil') || query.includes('surveying'))) ||
        (short === 'basic electronics' && (query.includes('electronics') || query.includes('bee'))) ||
        (short === 'design thinking' && (query.includes('design') || query.includes('innovation')))
      ) {
        matchedEntities.push(sub.name);
        return sub;
      }
    }
    return null;
  };

  const detectedSubject = detectSubject();

  // Helper to find faculty
  const detectFaculty = () => {
    for (const fac of facultyList) {
      const nameParts = fac.name.toLowerCase().split(' ');
      const lastName = nameParts[nameParts.length - 1];
      if (query.includes(fac.name.toLowerCase()) || (lastName.length > 3 && query.includes(lastName))) {
        matchedEntities.push(fac.name);
        return fac;
      }
    }
    return null;
  };

  const detectedFaculty = detectFaculty();

  // 1. INTENT: Faculty Query ("Who teaches OMP?", "Who is Dr. Reena Joshi?", "Where is faculty cabin?")
  if (
    query.includes('who teach') ||
    query.includes('teacher') ||
    query.includes('faculty') ||
    query.includes('professor') ||
    query.includes('cabin') ||
    query.includes('office') ||
    detectedFaculty ||
    (detectedSubject && (query.includes('who') || query.includes('teaches') || query.includes('sir') || query.includes('ma\'am') || query.includes('madam')))
  ) {
    if (detectedSubject) {
      // Find faculty for this subject and section
      const mapping = facultyMappings.find(m => m.section === section && m.subject_id === detectedSubject.id);
      const fac = mapping ? facultyList.find(f => f.id === mapping.faculty_id) : null;

      if (fac) {
        sources.push({
          type: 'faculty',
          title: `${fac.name} (${detectedSubject.short_name})`,
          details: `Cabin: ${fac.cabin} | Hours: ${fac.office_hours}`,
          link: '/student/faculty'
        });

        return {
          answer: `For **${section}**, **${detectedSubject.name} (${detectedSubject.short_name})** is taught by **${fac.name}** (${fac.title}, ${fac.department}).\n\n📍 **Cabin Location:** ${fac.cabin}\n⏰ **Consultation Hours:** ${fac.office_hours}\n✉️ **Email:** \`${fac.email}\``,
          sources,
          confidence: 0.95,
          matchedEntities,
          isFallback: false
        };
      }
    }

    if (detectedFaculty) {
      const mappedSubjects = facultyMappings
        .filter(m => m.faculty_id === detectedFaculty.id && m.section === section)
        .map(m => subjects.find(s => s.id === m.subject_id)?.name)
        .filter(Boolean);

      sources.push({
        type: 'faculty',
        title: detectedFaculty.name,
        details: detectedFaculty.cabin,
        link: '/student/faculty'
      });

      return {
        answer: `**${detectedFaculty.name}** is ${detectedFaculty.title} in the Department of **${detectedFaculty.department}**.\n\n📚 **Teaching in ${section}:** ${mappedSubjects.length > 0 ? mappedSubjects.join(', ') : 'Assigned across B.Tech first year'}\n📍 **Cabin:** ${detectedFaculty.cabin}\n⏰ **Office Hours:** ${detectedFaculty.office_hours}\n✉️ **Contact:** \`${detectedFaculty.email}\``,
        sources,
        confidence: 0.95,
        matchedEntities,
        isFallback: false
      };
    }
  }

  // 2. INTENT: Timetable ("What is today's timetable?", "Schedule for tomorrow", "Class schedule")
  if (
    query.includes('timetable') ||
    query.includes('schedule') ||
    query.includes('class today') ||
    query.includes('today\'s class') ||
    query.includes('timing') ||
    query.includes('routine')
  ) {
    if (timetableWeeks.length === 0) {
      return {
        answer: `No published timetable was found for section **${section}** in Orbit yet. Your department admin will release this week's timetable once finalized.`,
        sources: [{ type: 'timetable', title: `Timetable (${section})`, details: 'No active schedule' }],
        confidence: 0.9,
        matchedEntities: ['Timetable', section],
        isFallback: false
      };
    }

    // Determine target day
    const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const todayIndex = new Date().getDay();
    let targetDay = days[todayIndex];

    if (query.includes('tomorrow')) {
      targetDay = days[(todayIndex + 1) % 7];
    } else if (query.includes('monday')) targetDay = 'Monday';
    else if (query.includes('tuesday')) targetDay = 'Tuesday';
    else if (query.includes('wednesday')) targetDay = 'Wednesday';
    else if (query.includes('thursday')) targetDay = 'Thursday';
    else if (query.includes('friday')) targetDay = 'Friday';
    else if (query.includes('saturday')) targetDay = 'Saturday';

    if (targetDay === 'Sunday') {
      return {
        answer: `Today is Sunday! There are no scheduled classes for **${section}**. Campus academic blocks are closed for regular lectures.`,
        sources: [{ type: 'timetable', title: `${section} Schedule`, details: 'Sunday Holiday' }],
        confidence: 0.95,
        matchedEntities: ['Sunday'],
        isFallback: false
      };
    }

    const daySlots = timetableSlots
      .filter(s => s.day_of_week === targetDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (daySlots.length === 0) {
      return {
        answer: `There are no scheduled classes listed for **${targetDay}** in **${section}**'s published timetable.`,
        sources: [{ type: 'timetable', title: `${section} ${targetDay} Schedule`, details: 'No classes' }],
        confidence: 0.85,
        matchedEntities: [targetDay],
        isFallback: false
      };
    }

    let scheduleText = `Here is the schedule for **${targetDay}** (${section}):\n\n`;
    daySlots.forEach(slot => {
      const sub = subjects.find(s => s.id === slot.subject_id);
      const fac = facultyList.find(f => f.id === slot.faculty_id);
      const typeBadge = slot.slot_type === 'lab' ? '🧪 LAB' : slot.slot_type === 'tutorial' ? '📝 TUT' : '📖 LECTURE';
      scheduleText += `• **${slot.start_time} - ${slot.end_time}** [${typeBadge}]: **${sub?.name || 'Subject'}** with ${fac?.name || 'Faculty'} (📍 ${slot.room})\n`;
    });

    sources.push({
      type: 'timetable',
      title: `${section} Timetable (${targetDay})`,
      details: `${daySlots.length} sessions scheduled`,
      link: '/student/timetable'
    });

    return {
      answer: scheduleText,
      sources,
      confidence: 0.95,
      matchedEntities: [targetDay, section],
      isFallback: false
    };
  }

  // 3. INTENT: Notes & Resources ("Where are my PPS notes?", "Show Engineering Graphics resources", "Find lecture notes")
  if (
    query.includes('note') ||
    query.includes('resource') ||
    query.includes('ppt') ||
    query.includes('pdf') ||
    query.includes('pyq') ||
    query.includes('previous year') ||
    query.includes('material') ||
    query.includes('book') ||
    (detectedSubject && (query.includes('where') || query.includes('find') || query.includes('download') || query.includes('get')))
  ) {
    let matchedResources = resources;
    if (detectedSubject) {
      matchedResources = matchedResources.filter(r => r.subject_id === detectedSubject.id);
    }

    // Filter by type if mentioned
    if (query.includes('pyq') || query.includes('question paper')) {
      matchedResources = matchedResources.filter(r => r.resource_type === 'pyq');
    } else if (query.includes('ppt') || query.includes('slide')) {
      matchedResources = matchedResources.filter(r => r.resource_type === 'ppt');
    } else if (query.includes('practical') || query.includes('sheet') || query.includes('lab file')) {
      matchedResources = matchedResources.filter(r => r.resource_type === 'practical_file');
    }

    if (matchedResources.length > 0) {
      let resp = `Found **${matchedResources.length}** resource(s) in Orbit for ${detectedSubject ? `**${detectedSubject.name}**` : section}:\n\n`;
      matchedResources.forEach(res => {
        const sub = subjects.find(s => s.id === res.subject_id);
        const fac = facultyList.find(f => f.id === res.faculty_id);
        resp += `📄 **${res.title}**\n   • Subject: ${sub?.short_name || ''} | Faculty: ${fac?.name || ''} | Format: \`${res.file_ext.toUpperCase()}\` (${res.file_size || 'PDF'})\n\n`;

        sources.push({
          type: 'note',
          title: res.title,
          details: `${sub?.short_name} • ${res.file_size || 'Downloadable'}`,
          link: '/student/notes'
        });
      });

      resp += `You can view or download these directly from the **Notes & Resources** tab.`;

      return {
        answer: resp,
        sources,
        confidence: 0.9,
        matchedEntities,
        isFallback: false
      };
    } else if (detectedSubject) {
      return {
        answer: `I could not find any uploaded resources for **${detectedSubject.name}** matching your criteria yet. Please check back later or notify your faculty.`,
        sources: [{ type: 'note', title: detectedSubject.name, details: 'No notes uploaded' }],
        confidence: 0.8,
        matchedEntities: [detectedSubject.name],
        isFallback: false
      };
    }
  }

  // 4. INTENT: Assignments ("What assignments are pending?", "Due date for PPS", "Homework")
  if (
    query.includes('assignment') ||
    query.includes('homework') ||
    query.includes('submission') ||
    query.includes('due') ||
    query.includes('deadline') ||
    query.includes('marks')
  ) {
    let matchedAssignments = assignments;
    if (detectedSubject) {
      matchedAssignments = matchedAssignments.filter(a => a.subject_id === detectedSubject.id);
    }

    if (matchedAssignments.length > 0) {
      let resp = `Here are the active assignments for **${section}**:\n\n`;
      matchedAssignments.forEach(asg => {
        const sub = subjects.find(s => s.id === asg.subject_id);
        const dueDate = new Date(asg.due_date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        resp += `📌 **${asg.title}**\n   • Subject: ${sub?.short_name} | Priority: **${asg.priority.toUpperCase()}** | Due: **${dueDate}**\n   • ${asg.description.slice(0, 110)}...\n\n`;

        sources.push({
          type: 'assignment',
          title: asg.title,
          details: `Due: ${dueDate} (${asg.priority})`,
          link: '/student/assignments'
        });
      });

      return {
        answer: resp,
        sources,
        confidence: 0.92,
        matchedEntities,
        isFallback: false
      };
    } else {
      return {
        answer: `Great news! You have no pending assignments listed for **${section}** right now.`,
        sources: [{ type: 'assignment', title: 'Assignments', details: 'All clear' }],
        confidence: 0.85,
        matchedEntities: [section],
        isFallback: false
      };
    }
  }

  // 5. INTENT: Announcements / Notices ("Are there any new announcements?", "Notices", "Exams")
  if (
    query.includes('announcement') ||
    query.includes('notice') ||
    query.includes('exam') ||
    query.includes('mid sem') ||
    query.includes('news') ||
    query.includes('alert')
  ) {
    if (announcements.length > 0) {
      let resp = `Here are the latest official announcements for **${section}**:\n\n`;
      announcements.forEach(ann => {
        resp += `📢 **${ann.title}** (${ann.date})\n   ${ann.description}\n\n`;
        sources.push({
          type: 'announcement',
          title: ann.title,
          details: ann.date,
          link: '/student/announcements'
        });
      });

      return {
        answer: resp,
        sources,
        confidence: 0.9,
        matchedEntities,
        isFallback: false
      };
    }
  }

  // 6. INTENT: Labs & Workshops ("Where can I find lab files?", "OMP lab", "Turing lab")
  if (
    query.includes('lab') ||
    query.includes('practical') ||
    query.includes('workshop')
  ) {
    const labs = [
      { name: 'OMP Lab', location: 'Science Block Lab 2', faculty: 'Dr. Kavita Soni (DS-1) / Dr. Shivendra Tiwari (DS-2)' },
      { name: 'EG Lab', location: 'CAD Center Lab 1', faculty: 'Mr. Amit Chandak' },
      { name: 'BCE Lab', location: 'Civil Testing Yard & Survey Lab', faculty: 'Dr. Devaanshi Jagwani' },
      { name: 'PPS Lab', location: 'Turing Computer Lab 3', faculty: 'Mr. Amit Shrivastava' },
      { name: 'Electronics and Computer Workshop', location: 'EC Core Workshop Block', faculty: 'Dr. Sandeep Rangi' }
    ];

    let resp = `Here are the 1st Year Data Science Laboratory facilities and locations:\n\n`;
    labs.forEach(l => {
      resp += `🔬 **${l.name}**\n   • Location: **${l.location}**\n   • Faculty In-charge: ${l.faculty}\n\n`;
      sources.push({
        type: 'knowledge',
        title: l.name,
        details: l.location,
        link: '/student/faculty'
      });
    });

    return {
      answer: resp,
      sources,
      confidence: 0.92,
      matchedEntities: ['Labs'],
      isFallback: false
    };
  }

  // 7. Search Admin Knowledge Documents for policy, attendance, evaluation
  for (const doc of knowledgeDocs) {
    const textLower = doc.extracted_text.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    const queryWords = query.split(' ').filter(w => w.length > 3);

    const matchesWord = queryWords.some(w => textLower.includes(w) || titleLower.includes(w));
    if (matchesWord || (query.includes('attendance') && textLower.includes('attendance')) || (query.includes('policy') && textLower.includes('policy'))) {
      sources.push({
        type: 'knowledge',
        title: doc.title,
        details: doc.category
      });

      return {
        answer: `According to **${doc.title}**:\n\n${doc.extracted_text}`,
        sources,
        confidence: 0.85,
        matchedEntities: [doc.title],
        isFallback: false
      };
    }
  }

  // STRICT REQUIREMENT FROM PROMPT:
  // "If the answer is unavailable, respond:
  // 'I couldn't find this information in the available Orbit records. Please contact your admin.'
  // Do not pretend this is a full generative AI model if no LLM is connected."
  return {
    answer: "I couldn't find this information in the available Orbit records. Please contact your admin.",
    sources: [],
    confidence: 0.1,
    matchedEntities: [],
    isFallback: true
  };
}
