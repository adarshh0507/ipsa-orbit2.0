import React from 'react';

// A small looping animation: one day at college. A light travels along the day and
// each class lights up as it passes. Times match the real class timings.
const X0 = 40;
const X1 = 550;
const SPAN = X1 - X0;
const LOOP_SECONDS = 10;

interface Stop {
  x: number;
  label: string;
  time: string;
  mark: string;
  kind: 'class' | 'lunch' | 'activity';
}

const stops: Stop[] = [
  { x: 40, label: 'Class 1', time: '9:45', mark: '1', kind: 'class' },
  { x: 170, label: 'Class 2', time: '11:30', mark: '2', kind: 'class' },
  { x: 290, label: 'Lunch', time: '1:10', mark: '', kind: 'lunch' },
  { x: 410, label: 'Class 3', time: '1:40', mark: '3', kind: 'class' },
  { x: 550, label: 'Activity', time: '', mark: '+', kind: 'activity' },
];

export function DayOrbit() {
  return (
    <div className="w-full max-w-xl">
      <p className="mb-3 text-sm text-[#8A98C0]">Your day, always up to date</p>
      <svg
        viewBox="0 0 600 130"
        className="h-auto w-full"
        role="img"
        aria-label="A day at college: class 1 at 9:45, class 2 at 11:30, lunch, class 3 at 1:40, then an activity class"
      >
        <line x1={X0} y1={40} x2={X1} y2={40} stroke="#223260" strokeWidth={2} />

        {stops.map((stop) => {
          const delay = Math.min(((stop.x - X0) / SPAN) * LOOP_SECONDS, LOOP_SECONDS - 0.4);
          const isLunch = stop.kind === 'lunch';
          const r = isLunch ? 9 : 17;
          const stroke = isLunch ? '#FFB454' : '#5CE1E6';
          return (
            <g key={stop.label}>
              <circle
                className="day-node"
                style={{ ['--node-delay' as string]: `${delay}s` }}
                cx={stop.x}
                cy={40}
                r={r}
                fill="#0E1A3D"
                stroke={stroke}
                strokeWidth={1.5}
              />
              {stop.mark && (
                <text x={stop.x} y={46} textAnchor="middle" fontSize={16} fontWeight={700} fill="#E8EEFF">
                  {stop.mark}
                </text>
              )}
              <text x={stop.x} y={84} textAnchor="middle" fontSize={17} fontWeight={600} fill="#E8EEFF">
                {stop.label}
              </text>
              {stop.time && (
                <text x={stop.x} y={106} textAnchor="middle" fontSize={15} fill="#8A98C0">
                  {stop.time}
                </text>
              )}
            </g>
          );
        })}

        <g className="day-dot" style={{ ['--loop-time' as string]: `${LOOP_SECONDS}s`, ['--dot-travel' as string]: `${SPAN}px` }}>
          <circle cx={X0} cy={40} r={16} fill="#FFB454" fillOpacity={0.25} />
          <circle cx={X0} cy={40} r={7} fill="#FFB454" />
        </g>
      </svg>
    </div>
  );
}
