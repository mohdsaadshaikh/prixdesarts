import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';

interface ApproachTransitionProps {
  monument: MonumentDef;
  onComplete: () => void;
}

/**
 * Ceremonial approach: progressive black fade + salon title reveal.
 * Duration = monument.approachDuration (5-6s).
 */
const ApproachTransition = ({ monument, onComplete }: ApproachTransitionProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = monument.approachDuration * 1000;
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      setProgress(t);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 200);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [monument, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
      {/* Progressive black overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: '#0A0A0A',
          opacity: Math.min(progress * 2, 1),
        }}
      />

      {/* Salle title appears in second half */}
      {progress > 0.4 && (
        <motion.div
          className="relative z-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min((progress - 0.4) * 3, 1) }}
        >
          <span
            className="font-display uppercase"
            style={{
              fontSize: '8px',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.13)',
            }}
          >
            {monument.spaceSurtitle}
          </span>
          <span
            className="font-display uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.38em',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            {monument.spaceTitle}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ApproachTransition;
