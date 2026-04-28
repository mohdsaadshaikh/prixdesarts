import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONUMENTS, MONUMENT_ORDER, type MonumentDef } from '@/lib/constants';

interface MonumentOverlayProps {
  visible: boolean;
  onMonumentClick: (monument: MonumentDef) => void;
}

const HITBOX_W = 8;
const HITBOX_H = 6;

/**
 * Monument markers: luminous white rings rotating slowly.
 * Rest: opacity 0.15. Hover: opacity 0.7, ring accelerates, beam emerges.
 */
const MonumentOverlay = ({ visible, onMonumentClick }: MonumentOverlayProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!visible) return null;

  const monuments = MONUMENT_ORDER.map(id => MONUMENTS[id]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      {monuments.map((m) => {
        const isHovered = hoveredId === m.id;

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

            {/* Luminous ring */}
            <svg
              style={{
                position: 'absolute',
                left: `${m.pos.x}%`,
                top: `${m.pos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '64px',
                height: '64px',
                pointerEvents: 'none',
              }}
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="#fff8e7"
                strokeWidth="0.5"
                opacity={isHovered ? 0.7 : 0.15}
                style={{
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 32 32"
                  to="360 32 32"
                  dur={isHovered ? '8s' : '12s'}
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* Beam on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${m.pos.x}%`,
                    bottom: `${100 - m.pos.y + 3}%`,
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '25vh',
                    transformOrigin: 'bottom center',
                    background: `linear-gradient(to top, rgba(255,248,231,0.15), rgba(255,248,231,0.03), transparent)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </AnimatePresence>

            {/* Label on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${m.pos.x}%`,
                    top: `${m.pos.y - 8}%`,
                    transform: 'translateX(-50%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.5 }}
                >
                  <span
                    className="font-display italic"
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      color: '#f0ece4',
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
