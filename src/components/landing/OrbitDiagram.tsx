import React from 'react';
import { BookOpen, Calendar, FileCheck2, Users, Bell, type LucideIcon } from 'lucide-react';

const CX = 280;
const CY = 280;

interface OrbitNode {
  label: string;
  icon: LucideIcon;
  angle: number;
}

interface OrbitRing {
  radius: number;
  seconds: number;
  nodes: OrbitNode[];
}

const rings: OrbitRing[] = [
  {
    radius: 128,
    seconds: 60,
    nodes: [
      { label: 'Notes', icon: BookOpen, angle: 200 },
      { label: 'Timetable', icon: Calendar, angle: 20 },
    ],
  },
  {
    radius: 206,
    seconds: 95,
    nodes: [
      { label: 'Assignments', icon: FileCheck2, angle: 100 },
      { label: 'Faculty', icon: Users, angle: 220 },
      { label: 'Notices', icon: Bell, angle: 340 },
    ],
  },
];

export function OrbitDiagram() {
  return (
    <svg
      viewBox="0 0 560 560"
      className="w-full max-w-[560px] h-auto"
      role="img"
      aria-label="IPSA ORBIT at the centre, with Notes, Timetable, Assignments, Faculty and Notices orbiting around it"
    >
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB454" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFB454" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={120} fill="url(#sun-glow)" />

      {/* Faint outer guide ring */}
      <circle cx={CX} cy={CY} r={262} fill="none" stroke="#223260" strokeDasharray="2 8" />

      {rings.map((ring) => (
        <g
          key={ring.radius}
          className="orbit-ring"
          style={{ ['--orbit-time' as string]: `${ring.seconds}s` }}
        >
          <circle cx={CX} cy={CY} r={ring.radius} fill="none" stroke="#5CE1E6" strokeOpacity="0.35" />
          {ring.nodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = CX + ring.radius * Math.cos(rad);
            const y = CY + ring.radius * Math.sin(rad);
            const Icon = node.icon;
            return (
              <g key={node.label} transform={`translate(${x} ${y})`}>
                <g className="orbit-upright">
                  <circle r={27} fill="#0E1A3D" stroke="#5CE1E6" strokeWidth={1.5} />
                  <Icon x={-12} y={-12} width={24} height={24} stroke="#5CE1E6" strokeWidth={1.8} />
                  <text
                    y={48}
                    textAnchor="middle"
                    fontSize={17}
                    fontWeight={600}
                    fill="#E8EEFF"
                    stroke="#060C20"
                    strokeWidth={5}
                    paintOrder="stroke"
                  >
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      ))}

      <circle cx={CX} cy={CY} r={42} fill="#FFB454" />
      <text x={CX} y={CY + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#2A1A00">
        ORBIT
      </text>
    </svg>
  );
}
