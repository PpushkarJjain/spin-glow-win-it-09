// Framer Motion animation variants for Spin & Win app

export const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.5,
};

export const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" },
};

export const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
    transition: { duration: 0.3, yoyo: Infinity }
  },
  tap: { scale: 0.95 }
};

export const spinButtonVariants = {
  idle: { rotate: 0, scale: 1 },
  spinning: {
    rotate: 360,
    scale: 1.1,
    transition: {
      rotate: { duration: 2, ease: "easeInOut" as const, repeat: Infinity },
      scale: { duration: 0.3 }
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 15px 25px rgba(255,215,0,0.4)",
    transition: { duration: 0.3 }
  }
};

export const iconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" as const }
  },
  bounce: {
  y: [0, -10, 0],
  transition: {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "mirror" as const
  }
}};

export const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "backOut" as const }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: { duration: 0.3 }
  }
};

export const wheelVariants = {
  idle: { rotate: 0 },
  spinning: {
    rotate: 1440,
    transition: { duration: 3, ease: "easeOut" as const }
  }
};

export const prizeVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "backOut", delay: 0.2 }
  }
};

export const confettiVariants = {
  hidden: { opacity: 0, y: -100, rotate: 0 },
  visible: {
    opacity: 1,
    y: 100,
    rotate: 360,
    transition: { duration: 2, ease: "easeOut" }
  }
};
