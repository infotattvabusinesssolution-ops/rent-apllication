import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { REJECTION_REASONS } from '../../constants/categories';
import { AlertOctagon } from 'lucide-react';

export const AdRejectModal = ({ isOpen, onClose, onConfirm, adTitle, isLoading = false }) => {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedReason, additionalNotes);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Advertisement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-red-900">Confirm Rejection</p>
            <p className="text-red-700 mt-0.5">
              You are rejecting <span className="font-semibold">"{adTitle}"</span>. The seller will be notified of the reason.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Rejection Reason <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {REJECTION_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  selectedReason === reason
                    ? 'border-red-500 bg-red-50/50 text-red-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="rejectReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Additional Rejection Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Provide specific feedback to help the seller correct their listing..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading}>
            Reject Advertisement
          </Button>
        </div>
      </form>
    </Modal>
  );
};
