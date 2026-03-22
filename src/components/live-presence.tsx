"use client";

import { Badge } from "@/components/ui/badge";
import { useDropStore } from "@/store/drop-store";
import { motion } from "framer-motion";

export function LivePresence() {
  const activeUsers = useDropStore((state) => state.activeUsers);

  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <Badge className="border-emerald-300/40 bg-emerald-300/10 text-emerald-200">
        {activeUsers || "--"} people are inside DROP right now
      </Badge>
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-100"
      >
        A global Drop may happen at any moment
      </motion.span>
    </div>
  );
}
