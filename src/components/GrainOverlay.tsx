const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none"
    style={{ zIndex: 100, mixBlendMode: 'overlay' }}
  >
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" opacity="0.032" />
    </svg>
  </div>
);

export default GrainOverlay;
