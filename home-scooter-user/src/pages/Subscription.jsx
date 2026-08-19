import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscriptionApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { toast } from 'sonner';
import {
  Crown,
  CheckCircle2,
  QrCode,
  Send,
  ShieldCheck,
  Key,
  Copy,
  Calendar,
  Lock,
} from 'lucide-react';

export const Subscription = () => {
  const [copied, setCopied] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');

  const { data: status } = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: subscriptionApi.getSubscriptionStatus,
  });

  const submitMutation = useMutation({
    mutationFn: (txId) => subscriptionApi.submitSubscriptionPayment({ upiTransactionId: txId }),
    onSuccess: (res) => {
      toast.success(res.message);
    },
  });

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('rentapp@upi');
    setCopied(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Home & Scooter Admin, I paid ₹100 for subscription. My UPI Reference ID: ${upiTransactionId || 'UPI/423981099881'}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 text-white text-center space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full border border-amber-400/30">
          <Crown className="w-4 h-4" /> Subscription Membership
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Become a Subscriber for Just ₹100/-</h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-medium">
          Enjoy 10 days of advertisement-free marketplace browsing, exclusive facilities, and priority seller updates.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Benefits */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Subscriber Benefits & Rules</h3>
            <p className="text-xs text-slate-500 mt-0.5">What you receive with your ₹100 plan</p>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-sm">10 Days Advertisement-Free Access</p>
                <p className="text-slate-500 font-normal mt-0.5">Enjoy 3 + 7 Days = 10 Days total ad-free marketplace experience.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Exclusive Subscriber Facilities</p>
                <p className="text-slate-500 font-normal mt-0.5">Priority callback requests and direct seller WhatsApp contact access.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Personal Credentials Generated</p>
                <p className="text-slate-500 font-normal mt-0.5">Receive unique Username & Password upon admin payment verification.</p>
              </div>
            </div>
          </div>

          {/* Active Credentials Summary */}
          {status?.isSubscribed && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Membership Status
                </span>
                <Badge variant="success">10 DAYS ACTIVE</Badge>
              </div>
              <p className="text-emerald-800">
                Expires on: <strong className="font-black text-emerald-950">28 Aug 2026</strong> ({status.daysRemaining} days remaining)
              </p>
            </div>
          )}
        </Card>

        {/* Right Column: Payment & Screenshot Submission */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Pay ₹100 via UPI</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scan QR code or use official UPI ID below</p>
          </div>

          {/* QR Code Graphic Container */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl text-center space-y-4 border border-slate-800">
            <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              {/* Simulated Crisp QR Code */}
              <div className="w-full h-full border-4 border-slate-900 rounded-lg p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-900 rounded-md" />
                  <div className="w-8 h-8 bg-slate-900 rounded-md" />
                </div>
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  ₹100 UPI QR
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-slate-900 rounded-md" />
                  <div className="w-4 h-4 bg-blue-600 rounded-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Marketplace UPI ID</span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-sm font-black text-emerald-400">rentapp@upi</span>
                <button
                  onClick={handleCopyUPI}
                  className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Submission Steps */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter UPI Ref/UTR Number
            </label>
            <input
              type="text"
              value={upiTransactionId}
              onChange={(e) => setUpiTransactionId(e.target.value)}
              placeholder="e.g. UPI/423981099881"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
            />

            <Button
              variant="success"
              size="lg"
              className="w-full font-bold"
              onClick={handleWhatsAppSend}
              icon={Send}
            >
              Send Payment Screenshot on WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
