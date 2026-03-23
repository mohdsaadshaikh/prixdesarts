import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LAYERS = [
  { src: "/layer_skyline.webp",        p: 0.02, dx: 0     },
  { src: "/layer_sky.webp",            p: 0.04, dx: 0.008 },
  { src: "/layer_clouds.webp",         p: 0.06, dx: 0.015 },
  { src: "/layer_far_city.webp",       p: 0.08, dx: 0     },
  { src: "/layer_mid_city.webp",       p: 0.12, dx: 0     },
  { src: "/layer_eiffel.webp",         p: 0.10, dx: 0     },
  { src: "/layer_institut.webp",       p: 0.14, dx: 0     },
  { src: "/layer_opera.webp",          p: 0.14, dx: 0     },
  { src: "/layer_bridges.webp",        p: 0.16, dx: 0     },
  { src: "/layer_pyramid_bridge.webp", p: 0.18, dx: 0     },
  { src: "/layer_seine.webp",          p: 0.20, dx: 0     },
  { src: "/layer_water.webp",          p: 0.20, dx: 0     },
  { src: "/layer_boats.webp",          p: 0.22, dx: 0.004 },
  { src: "/layer_pyramide.webp",       p: 0.24, dx: 0     },
  { src: "/layer_foreground.webp",     p: 0.28, dx: 0     },
];

export default function Index() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

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
    const PAX = 40;
    const PAY = 14;

    const loop = (ts: number) => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.04;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.04;

      const sx = smooth.current.x;
      const sy = smooth.current.y;

      for (let i = 0; i < LAYERS.length; i++) {
        const el = refs.current[i];
        if (!el) continue;

        const layer = LAYERS[i];
        const tx = sx * PAX * layer.p * 4 + layer.dx * ts * 0.04;
        let ty = sy * PAY * layer.p * 4;

        // Drift + eau (toujours en translate, sans déformation géométrique)
        if (layer.src === "/layer_clouds.webp") ty += Math.sin(ts * 0.0012) * 1;
        if (layer.src === "/layer_boats.webp") {
          el.style.transform = `translate3d(${tx + ts * 0.0012}px, ${ty}px, 0) scale(1.04)`;
          continue;
        }
        if (layer.src === "/layer_seine.webp" || layer.src === "/layer_water.webp") {
          ty += Math.sin(ts * 0.0012) * 6; // vague verticale
        }

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#060608" }}>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
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
            }}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 52%, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>,
    mountNode
  );
}
