import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import RoomBase from './RoomBase';
import EngravingText from '../EngravingText';

const EDITIONS = [
  { year: 2021, label: 'Fondation' },
  { year: 2022, label: 'Expansion' },
  { year: 2023, label: 'Rayonnement' },
  { year: 2024, label: 'Consécration' },
  { year: 2026, label: 'Édition actuelle' },
];

/** SVG halos — gold dome radials */
const DomeHalos = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
    <defs>
      <radialGradient id="halo-gold1" cx="50%" cy="5%" r="30%">
        <stop offset="0%" stopColor="#d4b483" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#d4b483" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo-gold2" cx="45%" cy="12%" r="20%">
        <stop offset="0%" stopColor="#d4b483" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#d4b483" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Radiating lines pattern */}
    <g style={{ opacity: 0.15 }}>
      {[...Array(12)].map((_, i) => (
        <motion.line
          key={i}
          x1="500" y1="600"
          x2={500 + Math.cos((i * 15 - 165) * Math.PI / 180) * 1200}
          y2={600 + Math.sin((i * 15 - 165) * Math.PI / 180) * 1200}
          stroke="#d4b483"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.5 + i * 0.1 }}
        />
      ))}
    </g>

    <motion.rect
      width="1000" height="600" fill="url(#halo-gold1)"
      animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.rect
      width="1000" height="600" fill="url(#halo-gold2)"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
    />
  </svg>
);

const SalleInstitut = ({ monument }: { monument: MonumentDef }) => {
  return (
    <RoomBase
      roomKey="institut"
      photoSrc="/layer_institut.webp"
      accentColor={monument.accentColor}
      halos={<DomeHalos />}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center px-8 md:px-16">
        {/* Left — Text content (60%) */}
        <div className="flex-1 flex flex-col justify-center md:pr-12 py-12 md:py-0" style={{ maxWidth: '500px' }}>
          <motion.p
            className="font-mono-alt uppercase"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              color: 'rgba(212,180,131,0.45)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Salle II · L'Institution
          </motion.p>

          <h1 className="font-display mt-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#d4b483' }}>
            <EngravingText text="Institut" delay={0.6} />
            <br />
            <EngravingText text="de France" delay={0.9} />
          </h1>

          <motion.div
            className="mt-5"
            style={{ width: '28px', height: '1px', background: '#d4b483', opacity: 0.4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />

          <motion.p
            className="font-display italic mt-6"
            style={{
              fontSize: '0.95rem',
              lineHeight: 2,
              color: 'rgba(212,180,131,0.55)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            L'histoire du Prix, édition après édition, inscrite dans la pierre des Académies.
          </motion.p>
        </div>

        {/* Right — Vertical timeline (40%) */}
        <div className="flex-shrink-0 flex flex-col items-end justify-center relative" style={{ width: '40%', minWidth: '200px' }}>
          {EDITIONS.map((edition, i) => {
            const isCurrent = edition.year === 2026;
            const sizes = ['2rem', '2.2rem', '2.5rem', '3rem', '4.5rem'];
            const opacities = [0.15, 0.2, 0.3, 0.5, 1];

            return (
              <motion.div
                key={edition.year}
                className="relative flex items-center mb-4"
                style={{ width: '100%', justifyContent: 'flex-end', paddingRight: '0' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
              >
                {/* Year - Full right */}
                <div className="text-right" style={{ width: '100%' }}>
                  <span
                    className="font-display"
                    style={{
                      fontSize: sizes[i],
                      fontWeight: 300,
                      color: isCurrent ? '#d4b483' : 'rgba(212,180,131,0.3)',
                      lineHeight: 1.1,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {edition.year}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </RoomBase>
  );
};

export default SalleInstitut;
