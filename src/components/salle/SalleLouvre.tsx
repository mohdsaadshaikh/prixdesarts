import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import RoomBase from './RoomBase';
import EngravingText from '../EngravingText';

const LAUREATES = [
  {
    category: 'ÉMERGENTS',
    name: 'Marie Fontaine',
    artwork: 'Éclats de mémoire, 2025',
    subtitle: 'La Consécration',
  },
  {
    category: 'CONFIRMÉS',
    name: 'Thomas Marchand',
    artwork: 'Symphonie Urbaine, 2025',
    subtitle: 'La Consécration',
  },
  {
    category: 'INSTITUTIONS',
    name: 'Fondation Lumière',
    artwork: '50 ans de collection',
    subtitle: 'La Consécration',
  },
];

/** SVG halos — 3 white radial gradients simulating verrière light at top */
const VerriereHalos = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
    <defs>
      <radialGradient id="halo-w1" cx="40%" cy="8%" r="25%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo-w2" cx="55%" cy="5%" r="20%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo-w3" cx="65%" cy="10%" r="18%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <motion.rect
      width="1000" height="600" fill="url(#halo-w1)"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.rect
      width="1000" height="600" fill="url(#halo-w2)"
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />
    <motion.rect
      width="1000" height="600" fill="url(#halo-w3)"
      animate={{ opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />
  </svg>
);

const SalleLouvre = ({ monument }: { monument: MonumentDef }) => {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  return (
    <RoomBase
      roomKey="louvre"
      photoSrc="/layer_pyramide.webp"
      accentColor={monument.accentColor}
      halos={<VerriereHalos />}
    >
      <div className="w-full h-full flex flex-col">
        {/* Surtitre + Title */}
        <div className="pt-[8vh] px-8 md:px-16">
          <motion.p
            className="font-mono-alt uppercase"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.25)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Salle I · La Consécration
          </motion.p>
          <h1 className="font-display mt-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#f0ece4' }}>
            <EngravingText text="Pyramide" delay={0.6} />
            <br />
            <EngravingText text="du Louvre" delay={0.9} />
          </h1>
          <motion.div
            className="mt-4"
            style={{ width: '28px', height: '1px', background: '#ffffff', opacity: 0.4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
        </div>

        {/* Triptych — 3 equal panels */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch mt-8 md:mt-0">
          {LAUREATES.map((laureate, i) => {
            const isHovered = hoveredPanel === i;
            return (
              <motion.div
                key={i}
                className="relative cursor-pointer"
                style={{
                  flex: isHovered ? 1.5 : 1,
                  borderTop: isHovered ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'flex 0.6s cubic-bezier(0.25,1,0.5,1), border-top-color 0.4s ease',
                  padding: '3rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
                onMouseEnter={() => setHoveredPanel(i)}
                onMouseLeave={() => setHoveredPanel(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 + i * 0.15 }}
              >
                {/* Category */}
                <span
                  className="font-mono-alt uppercase"
                  style={{
                    fontSize: '0.42rem',
                    letterSpacing: '0.35em',
                    color: 'rgba(255,255,255,0.35)',
                    fontWeight: 300,
                    marginBottom: '1rem',
                  }}
                >
                  {laureate.category}
                </span>

                {/* Name */}
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                    fontWeight: 300,
                    color: '#f0ece4',
                    lineHeight: 1.2,
                    marginBottom: '0.5rem',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {laureate.name.split(' ').map((word, wi) => (
                    <span key={wi}>
                      {word}
                      {wi === 0 && <br />}
                    </span>
                  ))}
                </h2>

                {/* Artwork */}
                <p
                  className="font-display italic"
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {laureate.artwork}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </RoomBase>
  );
};

export default SalleLouvre;
