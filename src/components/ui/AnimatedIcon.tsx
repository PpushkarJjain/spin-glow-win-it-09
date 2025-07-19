import { motion } from 'framer-motion';
import { iconVariants } from '@/lib/variants';
import React from 'react';

interface AnimatedIconProps {
  children: React.ReactNode;
  shouldBounce?: boolean;
  delay?: number;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ children, shouldBounce = false, delay = 0 }) => {
  return (
    <motion.div
      variants={iconVariants}
      initial="hidden"
      animate={shouldBounce ? "bounce" : "visible"}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export { AnimatedIcon };
