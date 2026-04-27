import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import RoomBase from './RoomBase';
import EngravingText from '../EngravingText';

const EDITIONS = [
  { year: 2025, label: 'Édition' },
  { year: 2024, label: 'Édition' },
  { year: 2023, label: 'Édition' },
  { year: 2022, label: 'Édition' },
  { year: 2021, label: 'Édition' },
];

/** SVG halos — warm ivory floating stage lights */
const ChandelierHalos = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
    <defs>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <radialGradient key={i} id={`halo-ivory${i}`} cx={`${20 + Math.random() * 60}%`} cy={`${10 + Math.random() * 40}%`} r="15%">
          <stop offset="0%" stopColor="#e8d5c4" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e8d5c4" stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
    
    {/* Floating halos */}
    {[1, 2, 3, 4, 5, 6].map((n, i) => (
      <motion.circle
        key={n}
        r={60 + Math.random() * 120}
        fill={`url(#halo-ivory${n})`}
        animate={{ 
          x: [0, Math.random() * 100 - 50, 0],
          y: [0, Math.random() * 100 - 50, 0],
          opacity: [0.2, 0.5, 0.2] 
        }}
        transition={{ duration: 15 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ cx: `${10 + Math.random() * 80}%`, cy: `${10 + Math.random() * 50}%` }}
      />
    ))}
  </svg>
);

const SalleOpera = ({ monument }: { monument: MonumentDef }) => {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  return (
    <RoomBase
      roomKey="opera"
      photoSrc="/layer_opera.webp"
      accentColor={monument.accentColor}
      halos={<ChandelierHalos />}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center px-8 md:px-16">
        {/* Left — Text content (55%) */}
        <div className="flex-1 flex flex-col justify-center py-12 md:py-0 md:pr-12" style={{ maxWidth: '480px' }}>
          <motion.p
            className="font-mono-alt uppercase"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              color: 'rgba(232,213,196,0.4)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Salle III · La Scène
          </motion.p>

          <h1 className="font-display mt-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#f0ece4' }}>
            <EngravingText text="Opéra" delay={0.6} />
            <br />
            <EngravingText text="Garnier" delay={0.9} />
          </h1>

          <motion.div
            className="mt-5"
            style={{ width: '28px', height: '1px', background: '#e8d5c4', opacity: 0.4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />

          <motion.p
            className="font-display italic mt-6"
            style={{
              fontSize: '0.95rem',
              lineHeight: 2,
              color: 'rgba(232,213,196,0.55)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Cinq éditions. Cinq moments où l'art a basculé dans l'éternité.
          </motion.p>
        </div>

        {/* Right — Opera boxes (stacked with 3D tilt) */}
        <div className="flex flex-col gap-4 items-end justify-center" style={{ minWidth: '180px' }}>
          {EDITIONS.map((edition, i) => {
            const isHovered = hoveredBox === i;
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={edition.year}
                className="cursor-pointer"
                style={{
                  width: '160px',
                  height: '90px',
                  background: 'rgba(12,8,5,0.7)',
                  border: `1px solid ${isHovered ? 'rgba(232,213,196,0.4)' : 'rgba(232,213,196,0.1)'}`,
                  borderRadius: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `perspective(400px) rotateY(${isHovered ? (isEven ? -4 : 4) : (isEven ? -2 : 2)}deg) scale(${isHovered ? 1.02 : 1})`,
                  transition: 'all 0.4s ease',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={() => setHoveredBox(i)}
                onMouseLeave={() => setHoveredBox(null)}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + i * 0.12 }}
              >
                <span
                  className="font-display"
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 300,
                    color: isHovered ? '#e8d5c4' : 'rgba(232,213,196,0.6)',
                    letterSpacing: '0.05em',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {edition.year}
                </span>
                <span
                  className="font-mono-alt uppercase"
                  style={{
                    fontSize: '0.4rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(232,213,196,0.3)',
                    fontWeight: 300,
                    marginTop: '4px',
                  }}
                >
                  {edition.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </RoomBase>
  );
};

export default SalleOpera;
