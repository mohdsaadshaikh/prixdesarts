import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import RoomBase from './RoomBase';
import EngravingText from '../EngravingText';

interface JuryMember {
  name: string;
  title: string;
  x: number;  // % from left
  y: number;  // % from top
  isPresident?: boolean;
}

const JURY: JuryMember[] = [
  { name: 'Claire Dumont', title: 'Présidente', x: 50, y: 42, isPresident: true },
  { name: 'Jean Moreau', title: 'Académicien', x: 28, y: 24 },
  { name: 'Sophie Klein', title: "Critique d'art", x: 75, y: 24 },
  { name: 'Paul Bernard', title: 'Commissaire', x: 15, y: 55 },
  { name: 'Hélène Voss', title: 'Directrice', x: 85, y: 55 },
  { name: 'Marc Girard', title: 'Musicologue', x: 35, y: 80 },
  { name: 'Isabelle Roy', title: 'Chorégraphe', x: 65, y: 80 },
];

const CONSTELLATION_LINES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6]
];

/** SVG halos — steel blue at structural node positions */
const StructureHalos = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
    <defs>
      {[
        { id: 1, cx: '50%', cy: '8%', r: '18%', opacity: 0.12 },
        { id: 2, cx: '30%', cy: '25%', r: '12%', opacity: 0.06 },
        { id: 3, cx: '70%', cy: '25%', r: '12%', opacity: 0.06 },
        { id: 4, cx: '20%', cy: '50%', r: '10%', opacity: 0.04 },
        { id: 5, cx: '80%', cy: '50%', r: '10%', opacity: 0.04 },
        { id: 6, cx: '50%', cy: '75%', r: '14%', opacity: 0.05 },
      ].map(h => (
        <radialGradient key={h.id} id={`halo-steel${h.id}`} cx={h.cx} cy={h.cy} r={h.r}>
          <stop offset="0%" stopColor="#b8c8d4" stopOpacity={h.opacity} />
          <stop offset="100%" stopColor="#b8c8d4" stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
    {[1, 2, 3, 4, 5, 6].map((n, i) => (
      <motion.rect
        key={n}
        width="1000" height="600"
        fill={`url(#halo-steel${n})`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
      />
    ))}
  </svg>
);

const SalleEiffel = ({ monument }: { monument: MonumentDef }) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const president = JURY[0];

  return (
    <RoomBase
      roomKey="eiffel"
      photoSrc="/layer_eiffel.webp"
      accentColor={monument.accentColor}
      halos={<StructureHalos />}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative px-6 md:px-16">
        {/* Surtitle + Title (Top-Left) */}
        <div className="absolute top-[8vh] left-6 md:left-16 z-20">
        <motion.p
          className="font-mono-alt uppercase"
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.35em',
            color: 'rgba(184,200,212,0.4)',
            fontWeight: 300,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Salle V · La Lumière
        </motion.p>

        <h1 className="font-display mt-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#f0ece4' }}>
          <EngravingText text="Tour" delay={0.6} />
          <br />
          <EngravingText text="Eiffel" delay={0.9} />
        </h1>

        <motion.div
          className="mt-4"
          style={{ width: '28px', height: '1px', background: '#b8c8d4', opacity: 0.4 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        />
      </div>

      {/* SVG connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 11 }}>
        {CONSTELLATION_LINES.map(([from, to], i) => {
          const p1 = JURY[from];
          const p2 = JURY[to];
          const isRelated = hoveredMember === from || hoveredMember === to;
          return (
            <motion.line
              key={i}
              x1={`${p1.x}%`}
              y1={`${p1.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke={isRelated ? "#b8c8d4" : "rgba(184,200,212,0.15)"}
              strokeWidth={isRelated ? "1" : "0.5"}
              style={{
                transition: 'all 0.6s cubic-bezier(0.25,1,0.5,1)',
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 1 + i * 0.05 }}
            />
          );
        })}
      </svg>

      {/* Jury member nodes */}
      {JURY.map((member, i) => {
        const isHovered = hoveredMember === i;
        const dotSize = member.isPresident ? 16 : 10;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${member.x}%`,
              top: `${member.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={() => setHoveredMember(i)}
            onMouseLeave={() => setHoveredMember(null)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
          >
            {/* Node Halo */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(184,200,212,0.2) 0%, transparent 70%)',
                width: '60px',
                height: '60px',
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
              }}
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Dot */}
            <div
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                borderRadius: '50%',
                background: member.isPresident ? '#b8c8d4' : 'rgba(255,255,255,0.9)',
                boxShadow: isHovered
                  ? '0 0 15px rgba(184,200,212,0.8), 0 0 30px rgba(184,200,212,0.3)'
                  : member.isPresident
                    ? '0 0 10px rgba(184,200,212,0.4)'
                    : '0 0 5px rgba(255,255,255,0.2)',
                transition: 'all 0.4s ease',
              }}
            />

            {/* Name */}
            <span
              className="font-display whitespace-nowrap"
              style={{
                fontSize: '0.75rem',
                color: '#f0ece4',
                opacity: isHovered ? 1 : 0.7,
                transform: `scale(${isHovered ? 1.05 : 1})`,
                transition: 'all 0.3s ease',
                letterSpacing: '0.05em',
              }}
            >
              {member.name}
            </span>

            {/* Title */}
            <span
              className="font-mono-alt uppercase whitespace-nowrap"
              style={{
                fontSize: '0.38rem',
                letterSpacing: '0.2em',
                color: 'rgba(184,200,212,0.45)',
                fontWeight: 300,
              }}
            >
              {member.title}
            </span>
          </motion.div>
        );
      })}
        </div>
      </RoomBase>
    );
  };

export default SalleEiffel;
