import React from "react";
import { Link } from "react-router-dom";

export function DashboardSidebar({ items }) {
  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-sm">
      <div className="space-y-2">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white/60 hover:text-indigo-600 rounded-2xl transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="mt-auto pt-6">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white">
          <p className="text-xs font-medium opacity-80 mb-1">PRO PLAN</p>
          <p className="text-sm font-bold mb-3">Upgrade to unlock more stats</p>
          <button className="w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
