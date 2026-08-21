import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, CheckSquare, Square } from 'lucide-react';

export const EntrySelector = ({
  entryPrice = 99,
  maxEntriesPerUser = 5,
  userExistingEntriesCount = 0,
  onBuyEntries,
  isSubmitting = false,
}) => {
  const availableAllowed = Math.max(1, maxEntriesPerUser - userExistingEntriesCount);
  const [quantity, setQuantity] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const increment = () => {
    if (quantity < availableAllowed) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalAmount = entryPrice * quantity;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Select Number of Entries</h3>
          <p className="text-[11px] text-slate-500">
            ₹{entryPrice} per entry • Max {maxEntriesPerUser} per user
          </p>
        </div>
        {userExistingEntriesCount > 0 && (
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            You hold {userExistingEntriesCount} tickets
          </span>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-700">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 font-bold transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-black text-slate-900 w-6 text-center">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= availableAllowed}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
        <div className="flex justify-between">
          <span>Entries ({quantity}):</span>
          <span className="font-medium">₹{entryPrice} × {quantity}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-2">
          <span>Total Payable:</span>
          <span className="text-purple-700">₹{totalAmount}</span>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div
        onClick={() => setAcceptedTerms(!acceptedTerms)}
        className="flex items-start gap-2.5 cursor-pointer pt-1"
      >
        <div className="mt-0.5 text-purple-600 shrink-0">
          {acceptedTerms ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          I accept the Lucky Draw Terms & Rules. The winner is selected automatically by the system upon draw closing.
        </p>
      </div>

      {/* Purchase Button */}
      <button
        type="button"
        disabled={!acceptedTerms || isSubmitting || availableAllowed <= 0}
        onClick={() => onBuyEntries(quantity)}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
      >
        <ShoppingBag className="w-4 h-4" />
        {isSubmitting ? 'Initializing Payment...' : `BUY ${quantity} ${quantity === 1 ? 'ENTRY' : 'ENTRIES'} (₹${totalAmount})`}
      </button>
    </div>
  );
};
