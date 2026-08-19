import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tag, PlusCircle, MessageSquare, User } from 'lucide-react';

export const MobileBottomNav = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/sell"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Tag className="w-5 h-5" />
          <span>Sell</span>
        </NavLink>

        {/* Center Primary Post Ad Button */}
        <NavLink
          to="/post-ad"
          className="flex flex-col items-center gap-1 -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-white active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-blue-600">Post Ad</span>
        </NavLink>

        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chats</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
