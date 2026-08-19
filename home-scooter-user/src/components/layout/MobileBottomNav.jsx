import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, PlusCircle, MessageCircle, User } from 'lucide-react';

export const MobileBottomNav = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-6 h-6 ${isActive ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>Home</span>
            </>
          )}
        </NavLink>

        {/* Sell */}
        <NavLink
          to="/sell"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Store className="w-6 h-6" />
          <span>Sell</span>
        </NavLink>

        {/* Post Ad (Center Plus Button) */}
        <NavLink
          to="/post-ad"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`
          }
        >
          <PlusCircle className="w-7 h-7 text-slate-700 hover:text-blue-600 transition-colors" />
          <span>Post Ad</span>
        </NavLink>

        {/* Chats */}
        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <MessageCircle className="w-6 h-6" />
          <span>Chats</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="w-6 h-6" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
