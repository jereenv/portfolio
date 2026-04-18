"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ROLES = [
  "Backend engineer.",
  "Distributed systems.",
  "Latency nerd.",
  "Observability lifer.",
  "Kafka whisperer.",
];

export function RoleCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      aria-live="polite"
      className="flex h-5 items-center text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm"
    >
      <span className="mr-2 inline-block h-px w-4 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[i]}
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
