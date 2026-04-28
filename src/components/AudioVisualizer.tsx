import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  label?: string;
  active?: boolean;
}

const AudioVisualizer = ({ label = 'OPÉRA SCÈNE', active = true }: AudioVisualizerProps) => {
  return (
    <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
      <div className="flex items-end gap-[4px] h-10">
        {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
          <motion.div
            key={i}
            className="w-[1px] bg-white/60"
            animate={active ? {
              height: [h * 15, h * 35, h * 20, h * 40, h * 15][i % 5] + (Math.random() * 5),
              opacity: [0.3, 1, 0.3]
            } : { height: 4, opacity: 0.2 }}
            transition={{
              duration: 0.4 + (Math.random() * 0.4),
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear'
            }}
          />
        ))}
      </div>
      <span className="font-mono-alt text-[0.4rem] uppercase tracking-[0.45em] opacity-25">
        {label}
      </span>
    </div>
  );
};

export default AudioVisualizer;
