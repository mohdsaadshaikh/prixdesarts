import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CITY_LIGHTS } from '@/lib/constants';

interface CityLightsProps {
  active: boolean;
}

/**
 * Illumination sequence: ~20 light points ignite left-to-right
 * after the dot settles on the Seine.
 */
const CityLights = ({ active }: CityLightsProps) => {
  const [litLights, setLitLights] = useState<number[]>([]);

  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    CITY_LIGHTS.forEach((light, i) => {
      timers.push(
        setTimeout(() => {
          setLitLights(prev => [...prev, i]);
        }, light.delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 15 }}>
      {CITY_LIGHTS.map((light, i) => {
        const isLit = litLights.includes(i);
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${light.x}%`,
              top: `${light.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff8e7 0%, transparent 70%)',
            }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={isLit ? { scale: 1, opacity: 0.6 } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

export default CityLights;
