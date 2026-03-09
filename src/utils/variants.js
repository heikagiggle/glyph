
export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: "easeOut" } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const fadeScale = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export const letterVariant = {
  hidden:  { opacity: 0, scale: 0.5, rotate: -15 },
  visible: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 14 },
  },
};

export const modalBackdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

export const modalPanel = {
  hidden:  { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } },
};
