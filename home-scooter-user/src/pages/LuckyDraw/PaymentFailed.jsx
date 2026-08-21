import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';

export const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md shadow-red-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Payment Could Not Be Completed</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your transaction was cancelled or declined. No lucky draw entries were generated.
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <Link
            to="/lucky-draw"
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};
