import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import StaggeredLines from './StaggeredLines';

interface IrisTransitionProps {
  monument: MonumentDef;
  originPos: { x: number; y: number };
  onComplete: () => void;
}

/**
 * Iris effect — 3 movements:
 * 1. Ring closes (0.4s) — scales up, stroke thickens
 * 2. Crossing (0.6s) — clip-path circle reveals room
 * 3. Room settles (1.2s) — staggered reveal
 */
const IrisTransition = ({ monument, originPos, onComplete }: IrisTransitionProps) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 'done'>(1);
  const [clipRadius, setClipRadius] = useState(0);
  const [ringScale, setRingScale] = useState(1);
  const [ringStroke, setRingStroke] = useState(0.5);

  // Phase 1: Ring explosion (0.4s)
  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / 400, 1);
      setRingScale(1 + t * 2);
      setRingStroke(0.5 + t * 1.5);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase(2);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Phase 2: Clip-path opening (0.6s)
  useEffect(() => {
    if (phase !== 2) return;
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / 600, 1);
      // spring-like easing
      const eased = 1 - Math.pow(1 - t, 3);
      setClipRadius(eased * 150);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase(3);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Phase 3: settle (1.2s)
  useEffect(() => {
    if (phase !== 3) return;
    const timer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 50, pointerEvents: 'none' }}>
      {/* Ring explosion */}
      {phase === 1 && (
        <svg
          className="fixed inset-0"
          width="100%" height="100%"
          style={{ zIndex: 51 }}
        >
          <defs>
            <filter id="ring-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={`${originPos.x}%`}
            cy={`${originPos.y}%`}
            r={32 * ringScale}
            fill="none"
            stroke="#ffffff"
            strokeWidth={ringStroke}
            filter="url(#ring-glow)"
            opacity={0.8}
          />
        </svg>
      )}

      {/* Clip-path circle reveal */}
      {(phase === 2 || phase === 3) && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 52,
            background: monument.id === 'grandPalais' ? 'rgba(12,11,10,1)' : '#080808',
            clipPath: `circle(${clipRadius}% at ${originPos.x}% ${originPos.y}%)`,
          }}
        >
          {/* Room content preview during settle */}
          {phase === 3 && (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
              <motion.span
                className="font-display uppercase"
                style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.35em',
                  color: 'rgba(240,236,228,0.13)',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
              >
                {monument.spaceSurtitle}
              </motion.span>
              <motion.span
                className="font-display uppercase"
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.38em',
                  color: 'rgba(240,236,228,0.78)',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
              >
                {monument.spaceTitle}
              </motion.span>
              <div className="mt-4 opacity-60">
                <StaggeredLines />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IrisTransition;
