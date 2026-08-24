import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import { toast } from 'sonner';
import { Crown, ArrowLeft, CheckCircle2, Upload, QrCode, ShieldCheck } from 'lucide-react';

export const PremiumRenew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') || '3 Months';

  const member = premiumAuthStorage.getMember();

  const [formData, setFormData] = useState({
    userName: member?.userName || '',
    userPhone: member?.userPhone || '',
    userEmail: member?.userEmail || '',
    plan: initialPlan,
    paymentReference: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planPrices = {
    '1 Month': 299,
    '3 Months': 799,
    '6 Months': 1499,
    '12 Months': 2499,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.userPhone || !formData.paymentReference) {
      toast.error('Name, Mobile Phone, and UPI Transaction Reference are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append('userId', member?.userId || `USR-${Math.floor(1000 + Math.random() * 9000)}`);
      payload.append('userName', formData.userName);
      payload.append('userPhone', formData.userPhone);
      payload.append('userEmail', formData.userEmail);
      payload.append('plan', formData.plan);
      payload.append('amount', planPrices[formData.plan] || 299);
      payload.append('paymentReference', formData.paymentReference);

      if (selectedFile) {
        payload.append('paymentScreenshot', selectedFile);
      }

      const res = await premiumUserApi.submitUpgradeRequest(payload);
      if (res.success) {
        toast.success(res.message || 'Upgrade request submitted successfully!');
        if (premiumAuthStorage.getToken()) {
          navigate('/premium/dashboard');
        } else {
          navigate('/premium/login');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit upgrade request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link
          to="/premium"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Premium Overview
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Request Premium Upgrade / Renewal</h1>
              <p className="text-xs text-slate-500">Submit your payment proof to activate or extend your plan</p>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <QrCode className="w-4 h-4" /> UPI Payment Instructions
            </div>
            <p>
              Send payment via PhonePe / Google Pay / Paytm to UPI ID:{' '}
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-900">
                homescooter@upi
              </span>
            </p>
            <p className="text-[11px] text-amber-700">
              Amount to Pay for {formData.plan}:{' '}
              <span className="font-extrabold text-sm text-slate-900">₹{planPrices[formData.plan] || 299}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Plan Duration *</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-bold text-slate-800"
              >
                <option value="1 Month">1 Month (30 Days) — ₹299</option>
                <option value="3 Months">3 Months (90 Days) — ₹799 (Popular)</option>
                <option value="6 Months">6 Months (180 Days) — ₹1499</option>
                <option value="12 Months">12 Months (365 Days) — ₹2499</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="ramesh@example.com"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                UPI Reference / UTR Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 402918273645"
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Payment Screenshot (Optional but recommended)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting Request...' : 'SUBMIT UPGRADE REQUEST'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
