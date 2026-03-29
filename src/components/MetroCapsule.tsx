import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONUMENTS, MONUMENT_ORDER, type MonumentDef } from '@/lib/constants';

interface MetroCapsuleProps {
  visible: boolean;
  activeMonumentId: string | null;
  onStationClick: (monument: MonumentDef) => void;
  panoramaMode?: boolean;
}

/**
 * "Plan Lumière" — floating metro-style navigation capsule.
 * On panorama: discreet (opacity 0.5), lifts on hover.
 * In rooms: full opacity with active station pulse.
 */
const MetroCapsule = ({ visible, activeMonumentId, onStationClick, panoramaMode = false }: MetroCapsuleProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  if (!visible) return null;

  const stations = MONUMENT_ORDER.map(id => MONUMENTS[id]);

  return (
    <motion.div
      className="fixed z-[45] flex items-center justify-center"
      style={{
        bottom: '3vh',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: panoramaMode ? (hovered ? 1 : 0.5) : 1,
        y: panoramaMode && hovered ? -4 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setHoveredStation(null); }}
    >
      {/* Capsule */}
      <div
        style={{
          width: '400px',
          height: '52px',
          borderRadius: '40px',
          background: 'rgba(8,8,8,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '0 30px',
        }}
      >
        {/* Line name */}
        <span
          className="font-mono-alt uppercase"
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: 300,
            position: 'absolute',
            top: '8px',
          }}
        >
          Ligne des Arts
        </span>

        {/* Line + stations */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '2px',
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '1.5px',
              background: 'rgba(255,255,255,0.3)',
            }}
          />

          {/* Stations */}
          {stations.map((station, i) => {
            const isActive = activeMonumentId === station.id;
            const isStationHovered = hoveredStation === station.id;
            const leftPct = (i / (stations.length - 1)) * 100;

            return (
              <div
                key={station.id}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                }}
              >
                {/* Station tooltip */}
                <AnimatePresence>
                  {isStationHovered && (
                    <motion.span
                      className="font-display italic"
                      style={{
                        position: 'absolute',
                        bottom: '22px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        color: '#f0ece4',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {station.buildingName}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Station circle */}
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: `1.5px solid ${isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'}`,
                    background: isActive ? '#ffffff' : 'transparent',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.15)' : 'none',
                    animation: isActive ? 'pulse-ring 2s infinite' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => onStationClick(station)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0.08); }
        }
      `}</style>
    </motion.div>
  );
};

export default MetroCapsule;
