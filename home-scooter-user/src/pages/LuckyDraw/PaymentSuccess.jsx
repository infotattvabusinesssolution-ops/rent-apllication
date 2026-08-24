import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, ArrowRight, Gift } from 'lucide-react';

export const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order, tickets } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Payment Confirmed!</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your entries have been registered and tickets generated automatically.
          </p>
        </div>

        {order && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Entries Purchased:</span>
              <span className="font-bold text-purple-700">{order.quantity} Ticket(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-black text-slate-900">₹{order.amount}</span>
            </div>
          </div>
        )}

        {/* Animated Ticket Reveal */}
        {tickets && tickets.length > 0 && (
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-slate-700 block">Your Generated Ticket(s):</span>
            <div className="flex flex-wrap gap-2">
              {tickets.map((t, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs font-black bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  {t.ticketNumber}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 space-y-2">
          <Link
            to="/my-lucky-draws"
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-xs hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
          >
            View My Lucky Draw Tickets <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/lucky-draw"
            className="block text-xs font-bold text-slate-500 hover:text-slate-800 py-1"
          >
            Back to Lucky Draws Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
