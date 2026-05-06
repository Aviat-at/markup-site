"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function PageTransitionFlip({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "center top", perspective: 1500, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export function FlipReveal({ children, delay = 0, origin = "top" }: { children: React.ReactNode; delay?: number, origin?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: origin, transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

export function FlipCardHover({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 15, rotateX: 10, z: 50 }}
      whileTap={{ scale: 0.95, rotateY: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ height: "100%", perspective: 2000, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export function ListStagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      style={{ display: "flex", flexDirection: "column", gap: "12px", perspective: 1500 }}
    >
      {children}
    </motion.div>
  );
}

export function ListStaggerItemFlip({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, rotateX: -90 },
        visible: { opacity: 1, rotateX: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      style={{ transformOrigin: "bottom", transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
