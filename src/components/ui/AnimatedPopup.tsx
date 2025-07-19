import { motion, AnimatePresence } from 'framer-motion';
import { popupVariants } from '@/lib/variants';
import React from 'react';

interface AnimatedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AnimatedPopup: React.FC<AnimatedPopupProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="popup-content"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AnimatedPopup };
