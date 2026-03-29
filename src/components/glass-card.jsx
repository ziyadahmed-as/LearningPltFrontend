import React from "react";

export function GlassCard({ children, className = "" }) {
  return (
    <div className={`bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}
