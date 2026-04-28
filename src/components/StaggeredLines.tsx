import { motion } from 'framer-motion';

const StaggeredLines = () => {
  return (
    <div className="flex flex-col items-center gap-1 w-40 pointer-events-none overflow-visible">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="h-[1px] bg-white/15"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1 - (i * 0.2), opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: i * 0.08,
            ease: [0.19, 1, 0.22, 1]
          }}
          style={{ width: '100%', originX: 0.5 }}
        />
      ))}
    </div>
  );
};

export default StaggeredLines;
