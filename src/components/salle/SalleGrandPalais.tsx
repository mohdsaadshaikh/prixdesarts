import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import RoomBase from './RoomBase';
import EngravingText from '../EngravingText';

/** SVG halos — amber verrière arch at top */
const VerriereHalos = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
    <defs>
      <radialGradient id="halo-amber1" cx="35%" cy="6%" r="25%">
        <stop offset="0%" stopColor="#c9a35a" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#c9a35a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo-amber2" cx="55%" cy="4%" r="22%">
        <stop offset="0%" stopColor="#c9a35a" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#c9a35a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="halo-amber3" cx="70%" cy="8%" r="18%">
        <stop offset="0%" stopColor="#c9a35a" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#c9a35a" stopOpacity="0" />
      </radialGradient>
    </defs>
    {[1, 2, 3].map((n, i) => (
      <motion.rect
        key={n}
        width="1000" height="600"
        fill={`url(#halo-amber${n})`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
      />
    ))}
  </svg>
);

const SalleGrandPalais = ({ monument }: { monument: MonumentDef }) => {
  return (
    <RoomBase
      roomKey="grandPalais"
      photoSrc="/black_white.webp"
      accentColor={monument.accentColor}
      halos={<VerriereHalos />}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center px-8 md:px-16">
        {/* Left — Editorial text (50%) */}
        <div className="flex-1 flex flex-col justify-center py-12 md:py-0 md:pr-16" style={{ maxWidth: '520px' }}>
          <motion.p
            className="font-mono-alt uppercase"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              color: 'rgba(201,163,90,0.45)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Salle IV · L'Empreinte
          </motion.p>

          <h1 className="font-display mt-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#c9a35a' }}>
            <EngravingText text="Grand" delay={0.6} />
            <br />
            <EngravingText text="Palais" delay={0.9} />
          </h1>

          <motion.div
            className="mt-5"
            style={{ width: '28px', height: '1px', background: '#c9a35a', opacity: 0.4 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />

          <motion.p
            className="font-mono-alt mt-6"
            style={{
              fontSize: '0.9rem',
              lineHeight: 2,
              color: 'rgba(201,163,90,0.55)',
              fontWeight: 300,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Depuis 2021, le Prix des Arts et de la Culture réunit sous la grande nef les œuvres qui traverseront les siècles.
          </motion.p>

          {/* Marginal quote */}
          <motion.blockquote
            className="mt-8"
            style={{
              borderLeft: '1px solid rgba(201,163,90,0.3)',
              paddingLeft: '20px',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <p
              className="font-display italic"
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: 'rgba(201,163,90,0.55)',
                fontWeight: 300,
              }}
            >
              « L'art n'est pas ce que vous voyez,
              <br />
              mais ce que vous faites voir aux autres. »
            </p>
          </motion.blockquote>
        </div>

        {/* Right — Portrait placeholder (50%) */}
        <motion.div
          className="hidden md:flex items-center justify-center"
          style={{
            width: '40%',
            maxWidth: '360px',
            aspectRatio: '3/4',
            border: '1px solid rgba(201,163,90,0.08)',
            position: 'relative',
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {/* Placeholder content */}
          <div className="flex flex-col items-center justify-center gap-4 w-full h-full" style={{ background: 'rgba(201,163,90,0.02)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid rgba(201,163,90,0.12)',
                borderRadius: '50%',
              }}
            />
            <span
              className="font-mono-alt uppercase"
              style={{
                fontSize: '0.4rem',
                letterSpacing: '0.35em',
                color: 'rgba(201,163,90,0.25)',
                fontWeight: 300,
              }}
            >
              Portrait lauréat
            </span>
          </div>
        </motion.div>
      </div>
    </RoomBase>
  );
};

export default SalleGrandPalais;
