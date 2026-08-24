import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { REPORT_REASONS } from '../../constants/categories';
import { reportApi } from '../../api/reportApi';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export const ReportAdModal = ({ isOpen, onClose, adId, adTitle }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await reportApi.submitReport(adId, { reason, comment });
      toast.success(res.message);
      onClose();
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Advertisement" subtitle={`Help keep Home & Scooter safe for everyone`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">Reporting Ad #{adId}</p>
            <p className="text-amber-700 mt-0.5 line-clamp-1">"{adTitle}"</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Reason <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  reason === r
                    ? 'border-red-500 bg-red-50/50 text-red-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Information (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" isLoading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
