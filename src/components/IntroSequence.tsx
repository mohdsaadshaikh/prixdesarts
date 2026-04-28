import { useState, useEffect, useCallback, useRef } from "react";
import { CITY_LIGHTS } from "@/lib/constants";

interface IntroSequenceProps {
  onComplete: () => void;
}

const WORDS = ['recognize', 'what', 'will', 'become', 'heritage'];

/**
 * Intro Sequence — Opening Animation
 * A. Grain animé sur #080808
 * B. Maxime mot par mot (Cormorant Garamond 300 italic)
 * C. Effacement inverse, "." apparaît, héritage expire
 * D. Le point pulse puis migre vers la berge gauche de la Seine avec traînée canvas
 */
export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<'maxim' | 'dot' | 'done'>('maxim');
  const [visibleWords, setVisibleWords] = useState<boolean[]>(Array(5).fill(false));
  const [fadingWords, setFadingWords] = useState<boolean[]>(Array(5).fill(false));
  const [showPeriod, setShowPeriod] = useState(false);
  const [heritageFading, setHeritageFading] = useState(false);
  const [grainSeed, setGrainSeed] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Grain seed animation
  useEffect(() => {
    const iv = setInterval(() => setGrainSeed(s => s + 1), 4000);
    return () => clearInterval(iv);
  }, []);

  // Maxim sequence
  useEffect(() => {
    if (phase !== 'maxim') return;

    // Show words one by one, 380ms stagger
    WORDS.forEach((_, i) => {
      later(i * 380, () =>
        setVisibleWords(prev => { const n = [...prev]; n[i] = true; return n; })
      );
    });

    const allShown = WORDS.length * 380;

    // Pause 1.8s, then fade in exact order: recognize → what → will → become
    const fadeStart = allShown + 1800;
    const FADE_ORDER = [0, 1, 2, 3]; // recognize, what, will, become
    FADE_ORDER.forEach((wordIdx, step) => {
      later(fadeStart + step * 280, () =>
        setFadingWords(prev => { const n = [...prev]; n[wordIdx] = true; return n; })
      );
    });

    // "." appears right after "become" fades (last of the 4 words)
    later(fadeStart + 3 * 280 + 400, () => {
      setShowPeriod(true);

      // At that exact moment, start the dot migration and fade heritage
      later(50, () => {
        setPhase('dot');
        setHeritageFading(true);
      });
    });
  }, [phase, later]);

  // Dot migration with canvas trail
  useEffect(() => {
    if (phase !== 'dot') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get period position
    let startX = window.innerWidth * 0.52;
    let startY = window.innerHeight * 0.5;
    if (periodRef.current) {
      const r = periodRef.current.getBoundingClientRect();
      startX = r.left + r.width / 2;
      startY = r.top + r.height / 2;
    }

    // Target: first light of the city
    const firstLight = CITY_LIGHTS[0];
    const targetX = window.innerWidth * (firstLight.x / 100);
    const targetY = window.innerHeight * (firstLight.y / 100);

    // Pulse phase: 0.8s
    const pulseStart = performance.now();
    const pulseDuration = 800;
    const migrationDuration = 2000;

    // Trail history
    const trail: { x: number; y: number; t: number }[] = [];
    let done = false;

    const animate = (now: number) => {
      if (done) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulseElapsed = now - pulseStart;

      if (pulseElapsed < pulseDuration) {
        // Pulse: scale 1→1.4→1
        const pt = pulseElapsed / pulseDuration;
        const scale = 1 + 0.4 * Math.sin(pt * Math.PI);
        const radius = 3 * scale;

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0ece4';
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(startX, startY, radius * 4, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(startX, startY, 0, startX, startY, radius * 4);
        g.addColorStop(0, 'rgba(255,248,231,0.3)');
        g.addColorStop(1, 'rgba(255,248,231,0)');
        ctx.fillStyle = g;
        ctx.fill();

        requestAnimationFrame(animate);
        return;
      }

      // Migration phase
      const migElapsed = now - pulseStart - pulseDuration;
      const t = Math.min(migElapsed / migrationDuration, 1);
      // cubic-bezier(0.76, 0, 0.24, 1) approximation
      const eased = t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;

      const x = startX + (targetX - startX) * eased;
      const y = startY + (targetY - startY) * eased;

      // Record trail
      trail.push({ x, y, t: now });

      // Draw trail (12 frames, decreasing opacity)
      const trailWindow = 12;
      const recentTrail = trail.slice(-trailWindow);
      for (let i = 0; i < recentTrail.length; i++) {
        const alpha = ((i + 1) / recentTrail.length) * 0.4;
        const r = 2 * ((i + 1) / recentTrail.length);
        ctx.beginPath();
        ctx.arc(recentTrail[i].x, recentTrail[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,231,${alpha})`;
        ctx.fill();
      }

      // Main dot
      const dotSize = 3 + 5 * eased;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = '#f0ece4';
      ctx.fill();

      // Glow
      const glowR = dotSize * 3;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      glow.addColorStop(0, `rgba(255,248,231,${0.4 * (1 - t * 0.5)})`);
      glow.addColorStop(1, 'rgba(255,248,231,0)');
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Fade out over 0.6s
        const fadeStart = performance.now();
        const fadeOut = (now2: number) => {
          const ft = Math.min((now2 - fadeStart) / 600, 1);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const alpha = 1 - ft;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240,236,228,${alpha})`;
          ctx.fill();

          const g2 = ctx.createRadialGradient(x, y, 0, x, y, glowR);
          g2.addColorStop(0, `rgba(255,248,231,${0.3 * alpha})`);
          g2.addColorStop(1, 'rgba(255,248,231,0)');
          ctx.beginPath();
          ctx.arc(x, y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = g2;
          ctx.fill();

          if (ft < 1) {
            requestAnimationFrame(fadeOut);
          } else {
            done = true;
            setPhase('done');
            onComplete();
          }
        };
        requestAnimationFrame(fadeOut);
      }
    };

    requestAnimationFrame(animate);
  }, [phase, onComplete]);

  // Skip
  const handleSkip = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('done');
    onComplete();
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: '#080808',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Grain overlay */}
        <svg
          style={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            zIndex: 1, opacity: 0.032, transition: 'opacity 2s ease',
            pointerEvents: 'none',
          }}
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
              values="1 0 0 0 0.02  0 1 0 0 0.01  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#intro-grain)" />
        </svg>

        {/* Maxim */}
        {(phase === 'maxim' || phase === 'dot') && (
          <div
            style={{
              position: 'relative', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.4em', padding: '0 2rem',
            }}
          >
            {WORDS.map((word, i) => {
              const isHeritage = i === 4;
              const visible = visibleWords[i] && !(fadingWords[i] && !isHeritage);
              const fading = isHeritage && heritageFading;

              return (
                <span
                  key={i}
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                    letterSpacing: '0.12em',
                    color: '#f0ece4',
                    opacity: fading ? 0 : visible ? 1 : 0,
                    transform: `translateY(${visible || fading ? 0 : 8}px)`,
                    transition: `opacity ${fading ? '1.5s' : '1.1s'} ease-out, transform 1.1s ease-out`,
                    display: 'inline-block',
                    position: isHeritage ? 'relative' as const : undefined,
                  }}
                >
                  {word}
                  {isHeritage && (
                    <span
                      ref={periodRef}
                      style={{
                        position: 'absolute',
                        left: '100%',
                        bottom: 0,
                        color: '#f0ece4',
                        opacity: showPeriod && phase !== 'dot' ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      .
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        )}

        {/* Canvas for dot trail */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed', inset: 0,
            width: '100%', height: '100%',
            zIndex: 55, pointerEvents: 'none',
          }}
        />
      </div>

      {/* Skip */}
      <button
        onClick={handleSkip}
        style={{
          position: 'fixed', bottom: '2.5rem', right: '3rem',
          fontFamily: '"Montserrat", sans-serif',
          textTransform: 'uppercase',
          fontSize: '0.55rem', letterSpacing: '0.35em',
          color: 'rgba(240,236,228,0.1)',
          background: 'none', border: 'none',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          zIndex: 61,
          transition: 'all 0.4s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(240,236,228,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,236,228,0.1)'; }}
      >
        Skip
      </button>
    </>
  );
}
