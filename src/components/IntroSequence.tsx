import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface IntroSequenceProps {
  onComplete: () => void;
}

type MottoState = 'hidden' | 'appearing' | 'holding' | 'fading' | 'solo' | 'heritage-fading' | 'dot-only';

const words = ['Reconnaître', 'ce', 'qui', 'fera', 'héritage'];

/**
 * Phase 1: Threshold — white bg, "Entrer" breathe
 * Phase 2: Transition — white veil over black, uniform fade 3200ms
 * Phase 3: Motto — word-by-word, then dot migration
 */
const IntroSequence = ({ onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 'done'>(1);
  const [veilOpacity, setVeilOpacity] = useState(1);
  const [mottoState, setMottoState] = useState<MottoState>('hidden');
  const [showPeriod, setShowPeriod] = useState(false);
  const [glowValue, setGlowValue] = useState(0);
  const [dotVisible, setDotVisible] = useState(false);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [dotScale, setDotScale] = useState(5);
  const [dotColor, setDotColor] = useState('#FFFFFF');
  const [dotGlow, setDotGlow] = useState('none');
  const [dotOpacity, setDotOpacity] = useState(1);
  const [isHoveringEntrer, setIsHoveringEntrer] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const periodRef = useRef<HTMLSpanElement>(null);

  const addTimer = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  // Cleanup
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Phase 1 → 2: click "Entrer"
  const handleEnter = useCallback(() => {
    if (phase !== 1) return;
    setPhase(2);
  }, [phase]);

  // Phase 2: white veil fade over 3200ms
  useEffect(() => {
    if (phase !== 2) return;
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const t = Math.min((Date.now() - start) / 3200, 1);
      // opacity = 1 - t^1.6 (uniform fade, no radial)
      setVeilOpacity(1 - Math.pow(t, 1.6));
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase(3);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Phase 3: motto sequence
  useEffect(() => {
    if (phase !== 3) return;

    // T=0: start appearing
    setMottoState('appearing');

    // T=3600: words 0-3 fade out
    addTimer(3600, () => setMottoState('fading'));

    // T=5500: "héritage" solo with golden pulse, period appears
    addTimer(5500, () => {
      setMottoState('solo');
      setShowPeriod(true);
    });

    // T=9000: "héritage" fades
    addTimer(9000, () => setMottoState('heritage-fading'));

    // T=9200: dot migration starts
    addTimer(9200, () => {
      setMottoState('dot-only');

      // Capture period position
      let startX = 55;
      let startY = 50;
      if (periodRef.current) {
        const rect = periodRef.current.getBoundingClientRect();
        startX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        startY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      }

      setDotPos({ x: startX, y: startY });
      setDotScale(5);
      setDotColor('#FFFFFF');
      setDotGlow('none');
      setDotOpacity(1);
      setDotVisible(true);

      // Animate dot migration over 1800ms
      const migStart = Date.now();
      let raf: number;
      const animateDot = () => {
        const elapsed = Date.now() - migStart;
        const t = Math.min(elapsed / 1800, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        setDotPos({
          x: startX + (50 - startX) * eased,
          y: startY + (51 - startY) * eased,
        });
        setDotScale(5 + 10 * eased);
        const r = Math.round(255 + (201 - 255) * eased);
        const g = Math.round(255 + (168 - 255) * eased);
        const b = Math.round(255 + (76 - 255) * eased);
        setDotColor(`rgb(${r},${g},${b})`);
        setDotGlow(`0 0 ${40 * eased}px ${10 * eased}px rgba(201,168,76,${0.3 * eased})`);

        if (t < 1) {
          raf = requestAnimationFrame(animateDot);
        } else {
          // Fade out dot
          const fadeStart = Date.now();
          const fadeOut = () => {
            const ft = Math.min((Date.now() - fadeStart) / 400, 1);
            setDotOpacity(1 - ft);
            if (ft < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              setDotVisible(false);
              setPhase('done');
              onComplete();
            }
          };
          requestAnimationFrame(fadeOut);
        }
      };
      requestAnimationFrame(animateDot);
    });
  }, [phase, addTimer, onComplete]);

  // Glow pulse during 'solo'
  useEffect(() => {
    if (mottoState !== 'solo') { setGlowValue(0); return; }
    let raf: number;
    const animate = () => {
      setGlowValue(0.05 + Math.sin(Date.now() * 0.0021) * 0.035);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mottoState]);

  // Skip handler
  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('done');
    onComplete();
  }, [onComplete]);

  if (phase === 'done') return null;

  const getWordOpacity = (i: number): number => {
    if (mottoState === 'hidden') return 0;
    if (mottoState === 'appearing' || mottoState === 'holding') return 1;
    if (mottoState === 'fading' && i < 4) return 0;
    if (mottoState === 'fading' && i === 4) return 1;
    if (mottoState === 'solo') return i === 4 ? 1 : 0;
    if (mottoState === 'heritage-fading' || mottoState === 'dot-only') return 0;
    return 1;
  };

  const getWordTransition = (i: number) => {
    if (mottoState === 'appearing') return { duration: 1.1, delay: i * 0.4, ease: [0.25, 0.05, 0.25, 1] as [number, number, number, number] };
    if (mottoState === 'fading' && i < 4) return { duration: 0.8, delay: i * 0.2 };
    if (mottoState === 'heritage-fading') return { duration: 1.0 };
    return { duration: 0.5 };
  };

  const showMotto = phase === 3 && mottoState !== 'dot-only';
  const showSkip = phase === 2 || phase === 3;

  return (
    <>
      {/* Phase 1: Threshold — white background with "Entrer" */}
      {phase === 1 && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 60, background: '#fafafa' }}
        >
          <motion.button
            onClick={handleEnter}
            onMouseEnter={() => setIsHoveringEntrer(true)}
            onMouseLeave={() => setIsHoveringEntrer(false)}
            className="font-display italic cursor-pointer bg-transparent border-none"
            style={{
              fontSize: '1.4rem',
              fontWeight: 300,
              letterSpacing: isHoveringEntrer ? '0.38em' : '0.08em',
              color: '#111',
              opacity: isHoveringEntrer ? 0.68 : undefined,
              transition: 'letter-spacing 1.2s cubic-bezier(.4,0,.2,1), opacity 1.2s cubic-bezier(.4,0,.2,1)',
            }}
            animate={
              isHoveringEntrer
                ? { opacity: 0.68 }
                : { opacity: [0.30, 0.50, 0.30] }
            }
            transition={
              isHoveringEntrer
                ? { duration: 0.3 }
                : { opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }
            }
          >
            Entrer
          </motion.button>
        </div>
      )}

      {/* Phase 2: White veil fading uniformly over black */}
      {phase === 2 && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 60,
            background: '#FFFFFF',
            opacity: veilOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Phase 3: Motto + dot migration on dark bg */}
      {phase === 3 && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 55, background: '#060608' }}
        >
          {showMotto && (
            <div className="flex items-center justify-center gap-x-[0.4em] px-8">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="font-display italic"
                  style={{
                    fontSize: '1.4rem',
                    letterSpacing: '0.08em',
                    color: '#FFFFFF',
                    fontWeight: 300,
                    textShadow: i === 4 && mottoState === 'solo'
                      ? `0 0 30px rgba(201,168,76,${glowValue})`
                      : 'none',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: getWordOpacity(i) }}
                  transition={getWordTransition(i)}
                >
                  {word}
                  {i === 4 && showPeriod && (
                    <motion.span
                      ref={periodRef}
                      style={{ color: '#C9A84C' }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: mottoState === 'heritage-fading' || mottoState === 'dot-only' ? 0 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      .
                    </motion.span>
                  )}
                </motion.span>
              ))}
            </div>
          )}

          {/* Migrating dot */}
          {dotVisible && (
            <div
              style={{
                position: 'fixed',
                left: `${dotPos.x}%`,
                top: `${dotPos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${dotScale}px`,
                height: `${dotScale}px`,
                borderRadius: '50%',
                backgroundColor: dotColor,
                boxShadow: dotGlow,
                opacity: dotOpacity,
                zIndex: 56,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      )}

      {/* Skip button */}
      {showSkip && (
        <motion.button
          className="fixed font-display uppercase bg-transparent border-none cursor-pointer"
          style={{
            bottom: '2rem',
            right: '2.5rem',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.08)',
            transition: 'all 0.6s ease',
            zIndex: 61,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          onClick={handleSkip}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.35';
            e.currentTarget.style.letterSpacing = '0.25em';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '';
            e.currentTarget.style.letterSpacing = '0.2em';
          }}
        >
          Passer
        </motion.button>
      )}
    </>
  );
};

export default IntroSequence;
