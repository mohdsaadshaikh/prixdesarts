import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';

interface SalleEiffelProps {
  monument: MonumentDef;
}

const SalleEiffel = ({ monument }: SalleEiffelProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#080808' }}>
      {/* Background architectural motif */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/layer_eiffel.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) brightness(0.3)',
          opacity: 0.03,
        }}
      />

      {/* Totem */}
      <motion.div
        className="absolute font-display uppercase"
        style={{
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          letterSpacing: '0.2em',
          color: 'rgba(184,200,212,0.04)',
          fontWeight: 300,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        {monument.spaceTotem}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[55ch] text-center px-8">
        <motion.span
          className="font-display uppercase block"
          style={{
            fontSize: '8px',
            letterSpacing: '0.35em',
            color: 'rgba(240,236,228,0.13)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {monument.spaceSurtitle}
        </motion.span>
        <motion.h2
          className="font-display uppercase mt-3"
          style={{
            fontSize: '11px',
            letterSpacing: '0.38em',
            color: 'rgba(240,236,228,0.78)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
        >
          {monument.spaceTitle}
        </motion.h2>
        <motion.div
          className="mx-auto mt-4"
          style={{
            width: '30px',
            height: '1px',
            background: '#b8c8d4',
            opacity: 0.4,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.54 }}
        />
        <motion.p
          className="font-body mt-6"
          style={{
            fontSize: '10px',
            lineHeight: '2.5',
            color: 'rgba(240,236,228,0.37)',
            whiteSpace: 'pre-line',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.66 }}
        >
          {monument.spaceBody}
        </motion.p>
        <motion.span
          className="font-display uppercase block mt-8"
          style={{
            fontSize: '9px',
            letterSpacing: '0.32em',
            color: 'rgba(240,236,228,0.88)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {monument.spaceConnector}
        </motion.span>
      </div>
    </div>
  );
};

export default SalleEiffel;
