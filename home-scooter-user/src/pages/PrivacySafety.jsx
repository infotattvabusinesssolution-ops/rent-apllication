import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle, FileText } from 'lucide-react';

export const PrivacySafety = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-20 max-w-lg mx-auto px-2 sm:px-0 font-serif">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Privacy & Safety Guidelines
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Verified Listing Protection</h3>
            <p className="text-xs text-slate-500 font-light">Community safety rules & guidelines</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 font-light leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Seller Verification:</strong> All posted advertisements undergo verification before public publishing.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Direct Communication:</strong> Use our 1-to-1 Marketplace Chat to communicate securely with sellers.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Customer Verified Slip (CVS):</strong> Generating CVS slips sends explicit interest inquiries directly via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
