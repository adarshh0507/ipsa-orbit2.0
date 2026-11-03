import type { DaySchedule } from '@/lib/classSchedule';
import { LUNCH, formatRange } from '@/lib/classSchedule';

export const whatsappShareUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;

export function scheduleToText(section: string, dateLabel: string, schedule: DaySchedule): string {
  const lines = [`*IPSA ORBIT · ${section} · ${dateLabel}*`, ''];

  schedule.blocks.forEach((block, i) => {
    const details = block.periods
      .map((p) => [p.title, p.faculty, p.room].filter(Boolean).join(', '))
      .join(' + ');
    lines.push(`Lecture ${i + 1} (${formatRange(block.startMin, block.endMin)}): ${details}`);
    if (block.id === 'second') {
      lines.push(`Lunch (${formatRange(LUNCH.startMin, LUNCH.endMin)})`);
    }
  });

  if (schedule.activity) lines.push(`Activity: ${schedule.activity}`);
  return lines.join('\n');
}

export function noticeToText(section: string, title: string, description: string): string {
  return `*${title}*\n${description}\n\n_IPSA ORBIT · ${section}_`;
}
