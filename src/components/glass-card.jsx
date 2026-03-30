import React from "react";
import { motion } from "motion/react";

export function GlassCard({ children, className = "", ...props }) {
  return (
    <motion.div 
      className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(147,51,234,0.15)] hover:border-white/20 hover:-translate-y-1 ${className}`}
      {...props}
    >
      {/* Inner Highlight Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>
      {children}
    </motion.div>
  );
}
