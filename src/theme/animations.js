export const transitions = {
  default: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  bounce: { type: 'spring', stiffness: 400, damping: 25 },
  smooth: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: 15, transition: { duration: 0.2 } },
};
