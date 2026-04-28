import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IntroSequence from "@/components/IntroSequence";
import PaintingCanvas from "@/components/PaintingCanvas";
import CityLights from "@/components/CityLights";
import MonumentOverlay from "@/components/MonumentOverlay";
import BottomSignature from "@/components/BottomSignature";
import IrisTransition from "@/components/IrisTransition";
import MonumentSpace from "@/components/MonumentSpace";
import MetroCapsule from "@/components/MetroCapsule";
import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";
import AudioVisualizer from "@/components/AudioVisualizer";
import StaggeredLines from "@/components/StaggeredLines";
import { useAudio } from "@/hooks/useAudio";
import Lenis from "@studio-freight/lenis";
import type { MonumentDef } from "@/lib/constants";
import { MONUMENTS } from "@/lib/constants";

const LAYERS = [
  { src: "/layer_clouds.webp", p: 0.05, dx: 0.006 },
  { src: "/layer_boats.webp", p: 0.8, dx: 0.003, style: { width: "15%", height: "auto", bottom: "2%", left: "10%", objectFit: "contain" as const } },
];

const BW_FILTER = "grayscale(100%) contrast(1.05) brightness(0.82)";
const BASE_PAINTING_SRC = "/painting_bw.webp";

type PhaseOverride = "auto" | "intro" | "panorama";

type DebugStats = {
  innerHeight: number;
  viewportHeight: number;
  docHeight: number;
  bodyHeight: number;
  stageHeight: number;
  layerHeight: number;
  smoothX: number;
  smoothY: number;
};

type LayerDebugState = {
  visible: boolean;
  opacity: number;
};

const DEFAULT_LAYER_DEBUG: Record<string, LayerDebugState> = Object.fromEntries(
  LAYERS.map((layer) => [layer.src, { visible: true, opacity: 1 }]),
);

export default function Index() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markersRef = useRef<HTMLDivElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [usePaintingOnly, setUsePaintingOnly] = useState(false);
  const isDev = import.meta.env.DEV;
  const [hoveredMonument, setHoveredMonument] = useState<string | null>(null);

  const [introComplete, setIntroComplete] = useState(false);
  const [lightsActive, setLightsActive] = useState(false);
  const [monumentsVisible, setMonumentsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  // Room navigation state
  const [currentScreen, setCurrentScreen] = useState<'panorama' | 'iris' | 'room'>('panorama');
  const [activeMonument, setActiveMonument] = useState<MonumentDef | null>(null);
  // Iris transition logic
  const [irisOrigin, setIrisOrigin] = useState({ x: 50, y: 50 });

  const { play, fadeIn, fadeOut } = useAudio();
  const navigate = useNavigate();
  const { id: routeId } = useParams();

  // Sync route with state
  useEffect(() => {
    if (routeId && MONUMENTS[routeId]) {
      const target = MONUMENTS[routeId];
      if (activeMonument?.id !== routeId) {
        setActiveMonument(target);
        if (currentScreen === 'panorama') {
          setIrisOrigin({ x: target.pos.x, y: target.pos.y });
          setCurrentScreen('iris');
        } else if (currentScreen === 'room') {
          setIrisOrigin({ x: 50, y: 50 });
          setCurrentScreen('iris');
        }
      }
    } else if (!routeId && currentScreen === 'room') {
      setCurrentScreen('panorama');
      setActiveMonument(null);
      fadeOut('room');
      play('panorama');
    }
  }, [routeId, currentScreen]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleIrisComplete = useCallback(() => {
    setCurrentScreen('room');
    play('room');
  }, [play]);
  
  const handleMonumentClick = (id: string) => {
    navigate(`/room/${id}`);
  };

  const [phaseOverride, setPhaseOverride] = useState<PhaseOverride>("auto");
  const [debugOpen, setDebugOpen] = useState(isDev);
  const [layerDebugState, setLayerDebugState] =
    useState<Record<string, LayerDebugState>>(DEFAULT_LAYER_DEBUG);
  const [debugStats, setDebugStats] = useState<DebugStats>({
    innerHeight: 0,
    viewportHeight: 0,
    docHeight: 0,
    bodyHeight: 0,
    stageHeight: 0,
    layerHeight: 0,
    smoothX: 0,
    smoothY: 0,
  });

  useEffect(() => {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;inset:0;width:100%;height:var(--app-vh,100vh);z-index:9999;pointer-events:none;overflow:hidden;";
    document.body.appendChild(el);
    setMountNode(el);
    return () => {
      document.body.removeChild(el);
      setMountNode(null);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateVh = () => {
      const viewportHeight = Math.max(
        window.innerHeight,
        window.visualViewport?.height ?? 0,
      );
      root.style.setProperty("--app-vh", `${viewportHeight}px`);

      const compactWidth = window.innerWidth < 1024;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setUsePaintingOnly(compactWidth || coarsePointer);
    };

    updateVh();
    window.addEventListener("resize", updateVh, { passive: true });
    window.visualViewport?.addEventListener("resize", updateVh);

    return () => {
      window.removeEventListener("resize", updateVh);
      window.visualViewport?.removeEventListener("resize", updateVh);
    };
  }, []);

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

  useEffect(() => {
    let raf = 0;
    const loop = (ts: number) => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;
      const sx = smooth.current.x;
      const sy = smooth.current.y;

      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      for (let i = 0; i < LAYERS.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;
        const layer = LAYERS[i];
        
        // Match WebGL displacement factor of 0.05
        const maxX = vWidth * 0.05 * (layer.p || 0.1);
        const maxY = vHeight * 0.05 * (layer.p || 0.1);
        
        let tx = sx * maxX + (layer.dx || 0) * ts * 0.04;
        let ty = sy * maxY;

        if (layer.src === "/layer_clouds.webp") {
          tx += Math.sin(ts * 0.00002) * 80 + Math.sin(ts * 0.000047) * 3;
          ty += Math.sin(ts * 0.000067) * 1.2;
        }
        if (layer.src === "/layer_boats.webp") {
          tx += Math.sin(ts * 0.000015) * 60 + Math.sin(ts * 0.000091) * 2;
          ty += Math.sin(ts * 0.000073) * 1.5 + Math.sin(ts * 0.000131) * 0.8;
        }

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }

      if (markersRef.current) {
        // Markers sit at roughly 0.7 depth in the map
        const p = 0.7;
        const maxX = vWidth * 0.05 * p;
        const maxY = vHeight * 0.05 * p;
        const tx = sx * maxX;
        const ty = sy * maxY;
        markersRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleIntroComplete = useCallback(() => {
    if (phaseOverride !== "auto") return;
    setIntroComplete(true);
    setLightsActive(true);
    setTimeout(() => setMonumentsVisible(true), 2500);
    setTimeout(() => setLogoVisible(true), 4000);
  }, [phaseOverride]);

  useEffect(() => {
    if (!isDev) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "d" && event.shiftKey) {
        setDebugOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDev]);

  useEffect(() => {
    if (!isDev || !debugOpen) return;
    const id = window.setInterval(() => {
      const stageRect = mountNode?.getBoundingClientRect();
      const firstLayerRect = layerRefs.current[0]?.getBoundingClientRect();
      setDebugStats({
        innerHeight: window.innerHeight,
        viewportHeight: window.visualViewport?.height ?? window.innerHeight,
        docHeight: document.documentElement.clientHeight,
        bodyHeight: document.body.clientHeight,
        stageHeight: stageRect?.height ?? 0,
        layerHeight: firstLayerRect?.height ?? 0,
        smoothX: smooth.current.x,
        smoothY: smooth.current.y,
      });
    }, 200);
    return () => window.clearInterval(id);
  }, [debugOpen, isDev, mountNode]);

  const setLayerVisible = useCallback((src: string, visible: boolean) => {
    setLayerDebugState((prev) => ({
      ...prev,
      [src]: {
        ...(prev[src] ?? { visible: true, opacity: 1 }),
        visible,
      },
    }));
  }, []);

  const setLayerOpacity = useCallback((src: string, opacity: number) => {
    setLayerDebugState((prev) => ({
      ...prev,
      [src]: {
        ...(prev[src] ?? { visible: true, opacity: 1 }),
        opacity,
      },
    }));
  }, []);

  const resetLayerDebug = useCallback(() => {
    setLayerDebugState(DEFAULT_LAYER_DEBUG);
  }, []);

  const effectiveIntroComplete =
    phaseOverride === "panorama" || (phaseOverride === "auto" && introComplete);
  const effectiveLightsActive =
    phaseOverride === "panorama" || (phaseOverride === "auto" && lightsActive);
  const effectiveMonumentsVisible =
    phaseOverride === "panorama" ||
    (phaseOverride === "auto" && monumentsVisible);
  const effectiveLogoVisible =
    phaseOverride === "panorama" || (phaseOverride === "auto" && logoVisible);
  const showIntro =
    phaseOverride === "intro" || (phaseOverride === "auto" && !introComplete);

  if (!mountNode) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "var(--app-vh,100vh)",
        overflow: "hidden",
        background: "#080808",
        pointerEvents: "auto",
        cursor: effectiveMonumentsVisible ? "crosshair" : "default",
      }}
    >
      <div
        className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', filter: 'contrast(150%) brightness(1000%)' }}
      />
      <PaintingCanvas mouseRef={mouse} />
      {!usePaintingOnly &&
        LAYERS.map((layer, i) => {
          const controls = layerDebugState[layer.src] ?? {
            visible: true,
            opacity: 1,
          };
          return (
            <div
              key={layer.src}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "var(--app-vh,100vh)",
                willChange: "transform",
                overflow: "hidden",
                display: controls.visible ? "block" : "none",
                opacity: controls.opacity,
              }}
            >
              <img
                src={layer.src}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  display: "block",
                  userSelect: "none",
                  pointerEvents: "none",
                  filter: BW_FILTER,
                  ...(layer.style || {
                    inset: 0,
                    width: "100%",
                    height: "var(--app-vh,100vh)",
                    objectFit: "cover",
                    objectPosition: "center",
                  })
                }}
              />
            </div>
          );
        })}



      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div ref={markersRef} className="absolute inset-0" style={{ zIndex: 15 }}>
        <CityLights active={effectiveLightsActive} />

        {effectiveIntroComplete && (
          <motion.div
            className="font-mono-alt uppercase"
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              x: "-50%",
              fontSize: "0.85rem",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.95)",
              fontWeight: 400,
              pointerEvents: "none",
              zIndex: 20,
              textAlign: "center",
              lineHeight: "2.2",
              textShadow: "0 0 30px rgba(255,255,255,0.25)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2.5 }}
          >
            NOVEMBRE 2026
            <br />
            PARIS
          </motion.div>
        )}

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
          {effectiveIntroComplete &&
            Object.values(MONUMENTS).map((monument) => (
              <div
                key={monument.id}
                className="absolute"
                style={{
                  left: `${monument.pos.x}%`,
                  top: `${monument.pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredMonument(monument.id)}
                onMouseLeave={() => setHoveredMonument(null)}
              >
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{ width: "4rem", height: "4rem", cursor: "pointer" }}
                  onClick={() => handleMonumentClick(monument.id)}
                />

                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{ border: "1px solid rgba(255,248,231,0.15)" }}
                  initial={{ width: "3.5rem", height: "3.5rem" }}
                  animate={{
                    width: hoveredMonument === monument.id ? "4rem" : "3.5rem",
                    height: hoveredMonument === monument.id ? "4rem" : "3.5rem",
                    borderColor:
                      hoveredMonument === monument.id
                        ? "rgba(255,248,231,0.4)"
                        : "rgba(255,248,231,0.15)",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />

                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    background:
                      "radial-gradient(circle, rgba(255,248,231,0.1) 0%, transparent 60%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredMonument === monument.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
        </div>
      </div>

      {effectiveIntroComplete && (
        <>
          <div className="fixed bottom-12 right-12 z-[100]">
            <AudioVisualizer label="OPÉRA SCÈNE" active={true} />
          </div>

          {/* Decorative Staggered Lines — removed to avoid overlap above MetroCapsule */}

          {/* Metro Capsule (Dot Progress) */}
          <MetroCapsule
            visible={currentScreen !== 'iris'}
            activeMonumentId={currentScreen === 'room' ? activeMonument?.id : null}
            onStationClick={(monument: MonumentDef) => {
              navigate(`/room/${monument.id}`);
            }}
            panoramaMode={currentScreen === 'panorama'}
          />
        </>
      )}

      <MonumentOverlay
        visible={effectiveMonumentsVisible && currentScreen === 'panorama'}
        onMonumentClick={(monument: MonumentDef) => {
          navigate(`/room/${monument.id}`);
        }}
      />
      <BottomSignature visible={effectiveLogoVisible && currentScreen === 'panorama'} />


      {/* Iris Transition */}
      {currentScreen === 'iris' && activeMonument && (
        <IrisTransition
          monument={activeMonument}
          originPos={irisOrigin}
          onComplete={handleIrisComplete}
        />
      )}

      {/* Room */}
      {currentScreen === 'room' && activeMonument && (
        <MonumentSpace
          monument={activeMonument}
          visible={true}
          onClose={() => {
            navigate('/');
          }}
        />
      )}

      {/* Grain overlay — always on top */}
      <GrainOverlay />

      {/* Custom Cursor */}
      <CustomCursor />

      {isDev && debugOpen && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 120,
            minWidth: 280,
            maxWidth: 340,
            background: "rgba(8,8,8,0.88)",
            color: "#f0ece4",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            padding: "10px 12px",
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.45,
            pointerEvents: "auto",
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 700 }}>
            Panorama Debug (Shift+D)
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => setPhaseOverride("auto")}
              style={{
                padding: "2px 6px",
                border: "1px solid rgba(255,255,255,0.25)",
                background:
                  phaseOverride === "auto"
                    ? "rgba(255,255,255,0.16)"
                    : "transparent",
                color: "inherit",
              }}
            >
              auto
            </button>
            <button
              type="button"
              onClick={() => setPhaseOverride("intro")}
              style={{
                padding: "2px 6px",
                border: "1px solid rgba(255,255,255,0.25)",
                background:
                  phaseOverride === "intro"
                    ? "rgba(255,255,255,0.16)"
                    : "transparent",
                color: "inherit",
              }}
            >
              intro
            </button>
            <button
              type="button"
              onClick={() => setPhaseOverride("panorama")}
              style={{
                padding: "2px 6px",
                border: "1px solid rgba(255,255,255,0.25)",
                background:
                  phaseOverride === "panorama"
                    ? "rgba(255,255,255,0.16)"
                    : "transparent",
                color: "inherit",
              }}
            >
              panorama
            </button>
          </div>
          <div>innerHeight: {debugStats.innerHeight.toFixed(1)}px</div>
          <div>visualViewport: {debugStats.viewportHeight.toFixed(1)}px</div>
          <div>documentElement: {debugStats.docHeight.toFixed(1)}px</div>
          <div>body: {debugStats.bodyHeight.toFixed(1)}px</div>
          <div>stageRect: {debugStats.stageHeight.toFixed(1)}px</div>
          <div>layer[0] rect: {debugStats.layerHeight.toFixed(1)}px</div>
          <div>
            smooth: {debugStats.smoothX.toFixed(3)},{" "}
            {debugStats.smoothY.toFixed(3)}
          </div>
          <div>phase: {phaseOverride}</div>

          <div style={{ marginTop: 10, marginBottom: 6, fontWeight: 700 }}>
            Layer Controls
          </div>
          <button
            type="button"
            onClick={resetLayerDebug}
            style={{
              padding: "2px 6px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "transparent",
              color: "inherit",
              marginBottom: 8,
            }}
          >
            reset layers
          </button>
          <div
            style={{
              maxHeight: 220,
              overflowY: "auto",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 6,
            }}
          >
            {LAYERS.map((layer) => {
              const controls = layerDebugState[layer.src] ?? {
                visible: true,
                opacity: 1,
              };
              const label = layer.src
                .replace("/layer_", "")
                .replace(".webp", "")
                .replaceAll("_", " ");

              return (
                <div key={`${layer.src}-debug`} style={{ marginBottom: 8 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textTransform: "capitalize",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={controls.visible}
                      onChange={(event) =>
                        setLayerVisible(layer.src, event.target.checked)
                      }
                    />
                    <span>{label}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(controls.opacity * 100)}
                    onChange={(event) =>
                      setLayerOpacity(
                        layer.src,
                        Number(event.target.value) / 100,
                      )
                    }
                    style={{ width: "100%" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
    </div>,
    mountNode,
  );
}
