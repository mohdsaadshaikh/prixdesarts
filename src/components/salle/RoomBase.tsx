import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RoomBaseProps {
  roomKey: string;
  photoSrc: string;
  accentColor: string;
  children: ReactNode;
  /** Optional SVG halos rendered between photo and content */
  halos?: ReactNode;
}

/**
 * RoomBase — shared wrapper for all 5 rooms.
 *
 * Layers (bottom → top):
 *  1. B&W room photo with subtle mouse-parallax
 *  2. SVG halos (mix-blend-mode: screen)
 *  3. Room-specific content (children)
 *  4. Watermark "A" (bottom-left, ghostly)
 */
const RoomBase = ({ roomKey, photoSrc, accentColor, children, halos }: RoomBaseProps) => {
  const photoRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle photo parallax on hover
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: '#0a0808' }}
      data-room={roomKey}
    >
      {/* Layer 1: Room photo (Full Screen) */}
      <motion.div
        ref={photoRef}
        className="absolute z-0"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${photoSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'grayscale(80%) contrast(1.1) brightness(0.5)',
          willChange: 'transform',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(1.1)`,
          transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, transparent 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Layer 2: SVG Halos */}
      {halos && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ mixBlendMode: 'screen', zIndex: 2 }}
        >
          {halos}
        </div>
      )}

      {/* Layer 3: Room content */}
      <motion.div
        className="relative z-10 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Layer 4: Watermark "A" */}
      <div
        className="absolute pointer-events-none select-none font-display"
        style={{
          bottom: '5vh',
          left: '3vw',
          fontSize: 'clamp(6rem, 15vw, 12rem)',
          fontWeight: 300,
          color: `rgba(255,255,255,0.025)`,
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        A
      </div>
    </div>
  );
};

export default RoomBase;
