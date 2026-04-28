import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONUMENTS, MONUMENT_ORDER, type MonumentDef } from '@/lib/constants';

interface MetroCapsuleProps {
  visible: boolean;
  activeMonumentId: string | null;
  onStationClick: (monument: MonumentDef) => void;
  panoramaMode?: boolean;
}

const MetroCapsule = ({ visible, activeMonumentId, onStationClick, panoramaMode = false }: MetroCapsuleProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  if (!visible) return null;

  const stations = MONUMENT_ORDER.map(id => MONUMENTS[id]);

  // Map to shorter names for the UI
  const getShortName = (id: string) => {
    switch (id) {
      case 'eiffel': return 'EIFFEL TOWER';
      case 'institut': return 'INSTITUT';
      case 'opera': return 'OPÉRA';
      case 'grandPalais': return 'GRAND PALAIS';
      case 'louvre': return 'LOUVRE';
      default: return id.toUpperCase();
    }
  };

  return (
    <motion.div
      className="fixed z-[45]"
      style={{
        bottom: '4vh',
        left: '50%',
        x: '-50%',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: panoramaMode ? (hovered ? 0.9 : 0.4) : 1,
        y: 0,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setHoveredStation(null); }}
    >
      {/* Outer Glow Container */}
      <div
        className="relative px-12 py-8 group"
      >
        {/* Main Capsule Body */}
        <div
          style={{
            width: '680px',
            height: '42px',
            borderRadius: '100px',
            background: 'rgba(10, 10, 10, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: 'inset 0 0 15px rgba(255,255,255,0.05), 0 10px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            position: 'relative',
          }}
        >
          {/* Internal Glow Rail */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              right: '40px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
            }}
          />

          {/* Active Line Segment */}
          {/* This would require calculating the progress based on activeMonumentId */}
          
          {/* Stations Mapping */}
          {stations.map((station, i) => {
            const isActive = activeMonumentId === station.id;
            const isHovered = hoveredStation === station.id;
            const isClickable = true;

            return (
              <div
                key={station.id}
                className="relative flex flex-col items-center"
                style={{ flex: 1 }}
              >
                {/* Station Node */}
                <div
                  className="relative cursor-pointer transition-all duration-500"
                  style={{
                    width: '18px',
                    height: '18px',
                    zIndex: 2,
                  }}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => onStationClick(station)}
                >
                  {/* Outer Ring */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: `1.5px solid ${isActive || isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}`,
                      boxShadow: isActive || isHovered ? '0 0 15px rgba(255,255,255,0.4)' : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  />
                  
                  {/* Inner Core */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      borderRadius: '50%',
                      background: isActive || isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)',
                      boxShadow: isActive || isHovered ? '0 0 10px #ffffff' : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  />

                  {/* Pulsing Aura for active */}
                  {isActive && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: '-10px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: -1,
                      }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Label */}
                <div
                  className="absolute"
                  style={{
                    top: '45px',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    className="font-mono text-[9px] tracking-[0.25em] uppercase transition-all duration-500"
                    style={{
                      color: isActive || isHovered ? '#ffffff' : 'rgba(255,255,255,0.4)',
                      textShadow: isActive || isHovered ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                      opacity: panoramaMode ? (hovered ? 1 : 0.5) : 1,
                    }}
                  >
                    {getShortName(station.id)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Glow Line Connector (Active progress) */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              right: '40px',
              height: '3px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
              borderRadius: '2px',
              zIndex: 1,
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to right, black 100%, transparent 100%)', // We'll animate this
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MetroCapsule;
