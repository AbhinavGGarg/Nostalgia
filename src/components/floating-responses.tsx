"use client";

import { useDropStore } from "@/store/drop-store";
import { motion } from "framer-motion";

export function FloatingResponses() {
  const ambient = useDropStore((state) => state.ambientResponses);

  if (!ambient.length) {
    return null;
  }

  return (
    <div className="pointer-events-none relative h-[220px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-4">
      {ambient.slice(0, 10).map((response, index) => (
        <motion.div
          key={`${response.submittedAt}-${index}`}
          initial={{ opacity: 0, y: 20, x: index % 2 ? -20 : 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="absolute max-w-[70%] rounded-full border border-cyan-200/40 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-50 backdrop-blur"
          style={{
            top: `${12 + (index % 5) * 36}px`,
            left: `${8 + ((index * 23) % 40)}%`,
          }}
        >
          {response.text}
        </motion.div>
      ))}
    </div>
  );
}
