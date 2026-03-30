import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from './glass-card';

export default function StatCard({ icon: Icon, label, value, trend, variant = 'primary' }) {
  const variants = {
    primary: 'bg-indigo-600 shadow-indigo-600/20',
    success: 'bg-emerald-600 shadow-emerald-500/20',
    warning: 'bg-amber-500 shadow-amber-500/20',
    error: 'bg-rose-600 shadow-rose-500/20',
    purple: 'bg-purple-600 shadow-purple-600/20',
    cyan: 'bg-cyan-600 shadow-cyan-600/20',
  };

  const bgStyle = variants[variant] || variants.primary;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <GlassCard className="p-8 bg-white border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${bgStyle.split(' ')[0]} opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity`} />
        
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className={`w-14 h-14 rounded-2xl ${bgStyle} flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110`}>
              <Icon size={24} />
            </div>
            
            {trend && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1">
              {label}
            </p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none truncate">
              {value}
            </h3>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
