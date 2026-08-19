import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const FilterBar = ({ children, onReset, activeCount = 0, className = '' }) => {
  return (
    <div className={`bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filters</span>
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </div>
  );
};
