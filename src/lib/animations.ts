export const EASE = [0.16, 1, 0.3, 1] as const;

export const vUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(5px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};
export const vIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};
export const vScale = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  show:   { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.6, ease: EASE } },
};
export const stagger = (d = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: d, delayChildren: 0.04 } },
});