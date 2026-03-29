import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import IntroSequence from "@/components/IntroSequence";
import MonumentOverlay from "@/components/MonumentOverlay";
import IrisTransition from "@/components/IrisTransition";
import MonumentSpace from "@/components/MonumentSpace";
import BottomSignature from "@/components/BottomSignature";
import CityLights from "@/components/CityLights";
import MetroCapsule from "@/components/MetroCapsule";
import MobileMessage from "@/components/MobileMessage";
import GrainOverlay from "@/components/GrainOverlay";
import { MONUMENTS, type MonumentDef } from "@/lib/constants";

const LAYERS = [
  { src: "/layer_sky.webp",            p: 0.02, dx: 0 },
  { src: "/layer_skyline.webp",        p: 0.03, dx: 0 },
  { src: "/layer_clouds.webp",         p: 0.05, dx: 0.006 },
  { src: "/layer_far_city.webp",       p: 0.07, dx: 0 },
  { src: "/layer_mid_city.webp",       p: 0.10, dx: 0 },
  { src: "/layer_eiffel.webp",         p: 0.09, dx: 0 },
  { src: "/layer_institut.webp",       p: 0.12, dx: 0 },
  { src: "/layer_opera.webp",          p: 0.12, dx: 0 },
  { src: "/layer_bridges.webp",        p: 0.14, dx: 0 },
  { src: "/layer_seine.webp",          p: 0.16, dx: 0 },
  { src: "/layer_water.webp",          p: 0.16, dx: 0 },
  { src: "/layer_pyramid_bridge.webp", p: 0.18, dx: 0 },
  { src: "/layer_boats.webp",          p: 0.20, dx: 0.003 },
  { src: "/layer_pyramide.webp",       p: 0.22, dx: 0 },
  { src: "/layer_foreground.webp",     p: 0.26, dx: 0 },
];

/** B&W filter applied to all layers */
const BW_FILTER = 'grayscale(100%) contrast(1.05) brightness(0.82)';

type AppPhase = 'intro' | 'panorama' | 'iris' | 'salle';

export default function Index() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const [appPhase, setAppPhase] = useState<AppPhase>('intro');
  const [selectedMonument, setSelectedMonument] = useState<MonumentDef | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [lightsActive, setLightsActive] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  // Portal mount node
  useEffect(() => {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.width = "100vw";
    el.style.height = "100vh";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
    setMountNode(el);
    return () => {
      document.body.removeChild(el);
      setMountNode(null);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Parallax animation loop
  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      const sx = smooth.current.x;
      const sy = smooth.current.y;

      for (let i = 0; i < LAYERS.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;

        const layer = LAYERS[i];
        // Foreground ±12px, sky ±2px
        const maxX = 2 + layer.p * 40;
        const maxY = 1 + layer.p * 20;
        let tx = sx * maxX + layer.dx * ts * 0.04;
        let ty = sy * maxY;

        // Cloud drift
        if (layer.src === "/layer_clouds.webp") {
          tx -= (ts * 0.0002);
        }
        // Boat drift
        if (layer.src === "/layer_boats.webp") {
          tx -= (ts * 0.00075);
        }
        // Water oscillation
        if (layer.src === "/layer_seine.webp" || layer.src === "/layer_water.webp") {
          tx += Math.sin(ts * 0.000785) * 4; // 8s cycle, ±4px (mapped from ±8px spec)
        }

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Intro complete → panorama + illumination sequence
  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setAppPhase('panorama');
    // Start city lights illumination
    setLightsActive(true);
    // Logo emerges after illumination (~4s)
    setTimeout(() => setLogoVisible(true), 4000);
  }, []);

  // Monument click → iris transition
  const handleMonumentClick = useCallback((monument: MonumentDef) => {
    setSelectedMonument(monument);
    setAppPhase('iris');
  }, []);

  // Iris complete → salle
  const handleIrisComplete = useCallback(() => {
    setAppPhase('salle');
  }, []);

  // Close salle → panorama (reverse iris)
  const handleCloseSalle = useCallback(() => {
    setSelectedMonument(null);
    setAppPhase('panorama');
  }, []);

  // Navigate between salles via metro
  const handleNavigateSalle = useCallback((monumentId: string) => {
    setSelectedMonument(MONUMENTS[monumentId]);
  }, []);

  // Metro station click
  const handleStationClick = useCallback((monument: MonumentDef) => {
    if (appPhase === 'panorama') {
      handleMonumentClick(monument);
    } else if (appPhase === 'salle') {
      setSelectedMonument(monument);
    }
  }, [appPhase, handleMonumentClick]);

  if (!mountNode) return null;

  const showPanorama = appPhase !== 'intro' || introComplete;
  const showMonuments = appPhase === 'panorama';

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#080808",
        cursor: showMonuments ? 'crosshair' : 'default',
        pointerEvents: 'auto',
      }}
    >
      {/* Parallax layers — B&W filtered */}
      {LAYERS.map((layer, i) => (
        <div
          key={layer.src}
          ref={(el) => { layerRefs.current[i] = el; }}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform",
            overflow: "hidden",
          }}
        >
          <img
            src={layer.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
              filter: BW_FILTER,
            }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 52%, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* City lights illumination */}
      <CityLights active={lightsActive && showPanorama} />

      {/* Edition plaque on Pont des Arts */}
      {showPanorama && (
        <div
          className="font-mono-alt uppercase"
          style={{
            position: 'absolute',
            left: '42%',
            top: '58%',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            color: 'rgba(240,236,228,0.6)',
            fontWeight: 300,
            pointerEvents: 'none',
            zIndex: 20,
            textAlign: 'center',
            lineHeight: '1.8',
          }}
        >
          NOVEMBER 2026<br />PARIS
        </div>
      )}

      {/* Monument rings + beams */}
      <MonumentOverlay
        visible={showMonuments}
        onMonumentClick={handleMonumentClick}
      />

      {/* Logo */}
      <BottomSignature visible={logoVisible && appPhase !== 'salle'} />

      {/* Metro capsule */}
      <MetroCapsule
        visible={appPhase === 'panorama' || appPhase === 'salle'}
        activeMonumentId={selectedMonument?.id ?? null}
        onStationClick={handleStationClick}
        panoramaMode={appPhase === 'panorama'}
      />

      {/* Intro sequence (velvet black) */}
      {!introComplete && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Iris transition */}
      {appPhase === 'iris' && selectedMonument && (
        <IrisTransition
          monument={selectedMonument}
          originPos={selectedMonument.pos}
          onComplete={handleIrisComplete}
        />
      )}

      {/* Salle */}
      <MonumentSpace
        monument={selectedMonument}
        visible={appPhase === 'salle'}
        onClose={handleCloseSalle}
        onNavigate={handleNavigateSalle}
      />

      {/* Grain overlay */}
      <GrainOverlay />

      {/* Mobile message */}
      <MobileMessage />
    </div>,
    mountNode,
  );
}
