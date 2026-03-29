import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import { MONUMENTS, MONUMENT_ORDER } from '@/lib/constants';
import SalleLouvre from './salle/SalleLouvre';
import SalleInstitut from './salle/SalleInstitut';
import SalleOpera from './salle/SalleOpera';
import SalleGrandPalais from './salle/SalleGrandPalais';
import SalleEiffel from './salle/SalleEiffel';

interface MonumentSpaceProps {
  monument: MonumentDef | null;
  visible: boolean;
  onClose: () => void;
  onNavigate: (monumentId: string) => void;
}

const MonumentSpace = ({ monument, visible, onClose, onNavigate }: MonumentSpaceProps) => {
  const [transitioning, setTransitioning] = useState(false);

  const handleInterRoomNav = useCallback((targetId: string) => {
    setTransitioning(true);
    setTimeout(() => {
      onNavigate(targetId);
      setTransitioning(false);
    }, 1100); // 0.8s fade + 0.3s pause
  }, [onNavigate]);

  if (!monument || !visible) return null;

  const currentIndex = MONUMENT_ORDER.indexOf(monument.id);
  const prevId = currentIndex > 0 ? MONUMENT_ORDER[currentIndex - 1] : null;
  const nextId = currentIndex < MONUMENT_ORDER.length - 1 ? MONUMENT_ORDER[currentIndex + 1] : null;
  const prevMonument = prevId ? MONUMENTS[prevId] : null;
  const nextMonument = nextId ? MONUMENTS[nextId] : null;

  const renderSalle = () => {
    switch (monument.id) {
      case 'louvre': return <SalleLouvre monument={monument} />;
      case 'institut': return <SalleInstitut monument={monument} />;
      case 'opera': return <SalleOpera monument={monument} />;
      case 'grandPalais': return <SalleGrandPalais monument={monument} />;
      case 'eiffel': return <SalleEiffel monument={monument} />;
      default: return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={monument.id}
        className="fixed inset-0"
        style={{ zIndex: 40, background: monument.id === 'grandPalais' ? 'rgba(12,12,11,1)' : '#0A0A0A' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: transitioning ? 0 : 1, filter: transitioning ? 'blur(10px)' : 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      >
        {renderSalle()}

        {/* ← Paris */}
        <motion.button
          className="fixed font-display bg-transparent border-none cursor-pointer z-50"
          style={{
            bottom: '2rem',
            left: '2.5rem',
            fontSize: '0.7rem',
            color: 'rgba(201, 168, 76, 0.12)',
            letterSpacing: '0.1em',
            transition: 'all 0.6s ease',
          }}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(201, 168, 76, 0.4)';
            e.currentTarget.style.textShadow = '0 0 20px rgba(201,168,76,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(201, 168, 76, 0.12)';
            e.currentTarget.style.textShadow = 'none';
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          ← Paris
        </motion.button>

        {/* Inter-room navigation */}
        {prevMonument && (
          <motion.button
            className="fixed font-display italic bg-transparent border-none cursor-pointer z-50"
            style={{
              top: '50%',
              left: '2rem',
              transform: 'translateY(-50%)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.06)',
              transition: 'all 0.7s ease',
            }}
            onClick={() => handleInterRoomNav(prevId!)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(0)';
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            ← {prevMonument.buildingName}
          </motion.button>
        )}
        {nextMonument && (
          <motion.button
            className="fixed font-display italic bg-transparent border-none cursor-pointer z-50"
            style={{
              top: '50%',
              right: '2rem',
              transform: 'translateY(-50%)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.06)',
              transition: 'all 0.7s ease',
            }}
            onClick={() => handleInterRoomNav(nextId!)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(0)';
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            {nextMonument.buildingName} →
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MonumentSpace;
