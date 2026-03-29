import React from "react";

export function GradientButton({ children, onClick, className = "", variant = "primary" }) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100",
    outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
