import React from "react";
import { 
  Bell, 
  Search, 
  User,
  LayoutDashboard
} from "lucide-react";

export function DashboardNavbar() {
  return (
    <div className="flex items-center justify-between h-16 px-6 mb-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          AdminPanel
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="pl-10 pr-4 py-2 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm w-64"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="flex items-center gap-2 p-1.5 hover:bg-white/50 rounded-xl transition-colors border border-transparent hover:border-white/40">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <span className="text-sm font-semibold text-gray-700 pr-2">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
