import { motion } from 'framer-motion';
import { buttonVariants, spinButtonVariants } from '@/lib/variants';
import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';

interface AnimatedButtonProps extends ButtonProps {
  isSpinButton?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, isSpinButton = false, ...props }, ref) => {
    const variants = isSpinButton ? spinButtonVariants : buttonVariants;

    return (
      <motion.div
        variants={variants}
        whileHover="hover"
        whileTap="tap"
      >
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
