import React from "react";
import { motion } from "motion/react";

export function GradientButton({ children, onClick, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-2xl group ${className}`}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-indigo-500 transition-all duration-500"></span>
      
      {/* Glow effect */}
      <span className="absolute inset-0 w-full h-full blur-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></span>
      
      <span className="relative px-8 py-4 bg-transparent text-white font-bold text-sm tracking-[0.05em] w-full h-full rounded-2xl flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
