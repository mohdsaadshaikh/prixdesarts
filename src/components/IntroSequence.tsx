import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface IntroSequenceProps {
  onComplete: () => void;
}

type Phase = 'maxim' | 'dissolve' | 'dot-migrate' | 'done';

const words = ['recognize', 'what', 'will', 'become', 'heritage'];

/**
 * Velvet Black preloader:
 * 1. Animated grain bg (#080808)
 * 2. Words appear one by one (Cormorant Garamond 300 italic)
 * 3. Words fade in reverse except "heritage" 
 * 4. "." appears after "heritage", heritage dissolves, dot migrates with trail
 */
const IntroSequence = ({ onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState<Phase>('maxim');
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [holdingHeritage, setHoldingHeritage] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const [heritageFading, setHeritageFading] = useState(false);
  const [dotMigrating, setDotMigrating] = useState(false);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [dotScale, setDotScale] = useState(5);
  const [dotOpacity, setDotOpacity] = useState(1);
  const [dotTrail, setDotTrail] = useState<{ x: number; y: number; opacity: number }[]>([]);
  const periodRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [grainSeed, setGrainSeed] = useState(0);

  const addTimer = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Animated grain seed
  useEffect(() => {
    const interval = setInterval(() => {
      setGrainSeed(s => s + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Maxim sequence
  useEffect(() => {
    if (phase !== 'maxim') return;

    // Show words one by one, 380ms interval
    words.forEach((_, i) => {
      addTimer(i * 380, () => {
        setVisibleWords(prev => [...prev, i]);
      });
    });

    // After all words shown, wait 1.5s then start reverse fade
    const allShownTime = words.length * 380 + 1500;
    
    // Fade words in reverse except "heritage" (index 4)
    for (let i = 3; i >= 0; i--) {
      addTimer(allShownTime + (3 - i) * 200, () => {
        setVisibleWords(prev => prev.filter(idx => idx !== i));
      });
    }

    // Heritage holds
    addTimer(allShownTime + 800, () => setHoldingHeritage(true));

    // Show period after all others gone
    addTimer(allShownTime + 1200, () => setShowPeriod(true));

    // Pause 1.2s then heritage dissolves (1.5s)
    addTimer(allShownTime + 2400, () => setHeritageFading(true));

    // Start dot migration after heritage fully faded
    addTimer(allShownTime + 3900, () => {
      setPhase('dot-migrate');
    });
  }, [phase, addTimer]);

  // Dot migration with trail
  useEffect(() => {
    if (phase !== 'dot-migrate') return;

    // Get period position
    let startX = 52;
    let startY = 50;
    if (periodRef.current) {
      const rect = periodRef.current.getBoundingClientRect();
      startX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      startY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    }

    // Target: Seine area (50, 51)
    const targetX = 50;
    const targetY = 51;

    setDotPos({ x: startX, y: startY });
    setDotScale(5);
    setDotOpacity(1);
    setDotMigrating(true);

    const migStart = Date.now();
    const duration = 1800;
    let raf: number;
    const trailPoints: { x: number; y: number; opacity: number; time: number }[] = [];

    const animate = () => {
      const elapsed = Date.now() - migStart;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      const x = startX + (targetX - startX) * eased;
      const y = startY + (targetY - startY) * eased;

      setDotPos({ x, y });
      setDotScale(5 + 10 * eased);

      // Add trail point
      trailPoints.push({ x, y, opacity: 0.6, time: Date.now() });

      // Update trail - fade older points
      const now = Date.now();
      const activeTrail = trailPoints
        .filter(p => now - p.time < 600)
        .map(p => ({
          x: p.x,
          y: p.y,
          opacity: Math.max(0, 0.6 * (1 - (now - p.time) / 600)),
        }));
      setDotTrail(activeTrail);

      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        // Fade out dot
        const fadeStart = Date.now();
        const fadeOut = () => {
          const ft = Math.min((Date.now() - fadeStart) / 400, 1);
          setDotOpacity(1 - ft);
          if (ft < 1) {
            requestAnimationFrame(fadeOut);
          } else {
            setDotMigrating(false);
            setPhase('done');
            onComplete();
          }
        };
        requestAnimationFrame(fadeOut);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase, onComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('done');
    onComplete();
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 60, background: '#080808' }}
      >
        {/* Animated grain overlay */}
        <svg
          className="fixed inset-0 pointer-events-none"
          width="100%" height="100%"
          style={{ zIndex: 1, opacity: 0.035, transition: 'opacity 2s ease' }}
        >
          <filter id="intro-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed={grainSeed}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.01
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#intro-grain)" />
        </svg>

        {/* Maxim words */}
        {phase === 'maxim' && (
          <div className="relative z-10 flex items-center justify-center gap-x-[0.4em] px-8">
            {words.map((word, i) => {
              const isVisible = visibleWords.includes(i);
              const isHeritage = i === 4;
              const shouldShow = isHeritage
                ? (isVisible && !heritageFading)
                : isVisible;

              return (
                <motion.span
                  key={i}
                  className="font-display italic"
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                    letterSpacing: '0.12em',
                    color: '#f0ece4',
                    fontWeight: 300,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: shouldShow ? 1 : 0,
                    y: shouldShow ? 0 : 8,
                  }}
                  transition={{
                    duration: isHeritage && heritageFading ? 1.5 : 0.6,
                    ease: 'easeOut',
                  }}
                >
                  {word}
                  {isHeritage && showPeriod && (
                    <motion.span
                      ref={periodRef}
                      style={{ color: '#f0ece4' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: heritageFading ? 1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      .
                    </motion.span>
                  )}
                </motion.span>
              );
            })}
          </div>
        )}

        {/* Migrating dot with trail */}
        {dotMigrating && (
          <>
            {/* Trail */}
            {dotTrail.map((point, i) => (
              <div
                key={i}
                style={{
                  position: 'fixed',
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#fff8e7',
                  opacity: point.opacity,
                  filter: `blur(${2 + (1 - point.opacity) * 4}px)`,
                  pointerEvents: 'none',
                  zIndex: 55,
                }}
              />
            ))}
            {/* Main dot */}
            <div
              style={{
                position: 'fixed',
                left: `${dotPos.x}%`,
                top: `${dotPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${dotScale}px`,
                height: `${dotScale}px`,
                borderRadius: '50%',
                backgroundColor: '#f0ece4',
                boxShadow: `0 0 ${dotScale * 2}px ${dotScale * 0.5}px rgba(255,248,231,0.3)`,
                opacity: dotOpacity,
                zIndex: 56,
                pointerEvents: 'none',
              }}
            />
          </>
        )}
      </div>

      {/* Skip button */}
      <motion.button
        className="fixed font-display uppercase bg-transparent border-none cursor-pointer"
        style={{
          bottom: '2rem',
          right: '2.5rem',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          color: 'rgba(240,236,228,0.06)',
          transition: 'all 0.6s ease',
          zIndex: 61,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        onClick={handleSkip}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.3';
          e.currentTarget.style.letterSpacing = '0.25em';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '';
          e.currentTarget.style.letterSpacing = '0.2em';
        }}
      >
        Skip
      </motion.button>
    </>
  );
};

export default IntroSequence;
