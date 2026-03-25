import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONUMENTS, MONUMENT_ORDER, type MonumentDef } from '@/lib/constants';

interface MonumentOverlayProps {
  visible: boolean;
  onMonumentClick: (monument: MonumentDef) => void;
}

/** Hitbox size in vw */
const HITBOX_W = 8;
const HITBOX_H = 6;

const MonumentOverlay = ({ visible, onMonumentClick }: MonumentOverlayProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [beamProgress, setBeamProgress] = useState<Record<string, number>>({});

  // Animate beam scaleY on hover
  useEffect(() => {
    if (!hoveredId) return;
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / 1600, 1);
      // cubic-bezier(0.16,1,0.3,1) approximation
      const eased = 1 - Math.pow(1 - t, 3);
      setBeamProgress(prev => ({ ...prev, [hoveredId]: eased }));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      setBeamProgress(prev => ({ ...prev, [hoveredId]: 0 }));
    };
  }, [hoveredId]);

  if (!visible) return null;

  const monuments = MONUMENT_ORDER.map(id => MONUMENTS[id]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {monuments.map((m) => {
        const isHovered = hoveredId === m.id;
        const progress = beamProgress[m.id] || 0;

        return (
          <div key={m.id}>
            {/* Hitbox */}
            <div
              className="absolute pointer-events-auto"
              style={{
                left: `${m.pos.x - HITBOX_W / 2}%`,
                top: `${m.pos.y - HITBOX_H / 2}%`,
                width: `${HITBOX_W}%`,
                height: `${HITBOX_H}%`,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onMonumentClick(m)}
            />

            {/* Ground halo */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${m.pos.x}%`,
                    top: `${m.pos.y + 2}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '12vw',
                    height: '4vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(201,168,76,0.09) 0%, transparent 70%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>

            {/* Light beam SVG */}
            <AnimatePresence>
              {isHovered && progress > 0 && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${m.pos.x}%`,
                    top: `${m.pos.y - 30}%`,
                    transform: 'translateX(-50%)',
                    width: '3vw',
                    height: '30vh',
                    transformOrigin: 'bottom center',
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: progress }}
                  exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.4 } }}
                  transition={{ duration: 0.1 }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 60 200" preserveAspectRatio="none">
                    <defs>
                      <filter id={`bloom-${m.id}`}>
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id={`beamGrad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(201,168,76,0)" />
                        <stop offset="30%" stopColor="rgba(201,168,76,0.15)" />
                        <stop offset="70%" stopColor="rgba(201,168,76,0.25)" />
                        <stop offset="100%" stopColor="rgba(201,168,76,0.05)" />
                      </linearGradient>
                    </defs>
                    {/* Cone shape */}
                    <polygon
                      points="25,0 35,0 50,200 10,200"
                      fill={`url(#beamGrad-${m.id})`}
                      filter={`url(#bloom-${m.id})`}
                    />
                    {/* Central filament */}
                    <line
                      x1="30" y1="0" x2="30" y2="200"
                      stroke="rgba(201,168,76,0.3)"
                      strokeWidth="0.5"
                      opacity={0.5 + Math.sin(Date.now() * 0.005) * 0.3}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Label at 70% beam height */}
            <AnimatePresence>
              {isHovered && progress > 0.3 && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${m.pos.x + 2}%`,
                    top: `${m.pos.y - 20}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  transition={{ duration: 0.5 }}
                >
                  <span
                    className="font-display italic uppercase"
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      color: '#C9A84C',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default MonumentOverlay;
