"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientBackdrop({ intense = false }: { intense?: boolean }) {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.18),transparent_35%),radial-gradient(circle_at_40%_85%,rgba(250,204,21,0.18),transparent_40%),#02030a]" />

      <motion.div
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 80, -30, 0],
                y: [0, -50, 30, 0],
              }
        }
        transition={{ duration: intense ? 12 : 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-fuchsia-400/12 blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [40, -20, 60, 40],
                y: [-20, 70, 20, -20],
              }
        }
        transition={{ duration: intense ? 10 : 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-8rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-300/12 blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : {
                scale: [1, 1.12, 0.96, 1],
              }
        }
        transition={{ duration: intense ? 7 : 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
