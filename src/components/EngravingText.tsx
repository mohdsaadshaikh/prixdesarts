import { motion } from 'framer-motion';

interface EngravingTextProps {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * EngravingText — a clip-path reveal animation.
 * Text is "engraved" left-to-right via clip-path inset transition.
 */
const EngravingText = ({ text, delay = 0, className = '', style }: EngravingTextProps) => {
  return (
    <motion.span
      className={className}
      style={{
        display: 'inline-block',
        ...style,
      }}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.77, 0, 0.18, 1],
      }}
    >
      {text}
    </motion.span>
  );
};

export default EngravingText;
