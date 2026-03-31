import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import IntroSequence from "@/components/IntroSequence";

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

const BW_FILTER = "grayscale(100%) contrast(1.05) brightness(0.82)";

export default function Index() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  // Portal mount
  useEffect(() => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;";
    document.body.appendChild(el);
    setMountNode(el);
    return () => { document.body.removeChild(el); setMountNode(null); };
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

  // Parallax loop
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
        const maxX = 2 + layer.p * 40;
        const maxY = 1 + layer.p * 20;
        let tx = sx * maxX + layer.dx * ts * 0.04;
        let ty = sy * maxY;

        if (layer.src === "/layer_clouds.webp") tx -= ts * 0.0002;
        if (layer.src === "/layer_boats.webp") tx -= ts * 0.00075;
        if (layer.src === "/layer_seine.webp" || layer.src === "/layer_water.webp") {
          tx += Math.sin(ts * 0.000785) * 4;
        }

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#080808", pointerEvents: "auto" }}>
      {/* Parallax layers */}
      {LAYERS.map((layer, i) => (
        <div
          key={layer.src}
          ref={(el) => { layerRefs.current[i] = el; }}
          style={{ position: "absolute", inset: 0, willChange: "transform", overflow: "hidden" }}
        >
          <img
            src={layer.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              display: "block", userSelect: "none", pointerEvents: "none",
              filter: BW_FILTER,
            }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 52%, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.92) 100%)",
      }} />

      {/* Intro sequence (covers panorama until complete) */}
      {!introComplete && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}
    </div>,
    mountNode,
  );
}
