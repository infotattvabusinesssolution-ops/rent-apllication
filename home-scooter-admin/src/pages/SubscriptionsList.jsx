import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { subscriptionApi } from '../api/subscriptionApi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { ImageLightbox } from '../components/ui/ImageLightbox';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export const SubscriptionsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentTab, setCurrentTab] = useState('Pending');
  const [search, setSearch] = useState('');

  const [inspectingSub, setInspectingSub] = useState(null);
  const [activationResult, setActivationResult] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ['subscriptions', currentTab, search],
    queryFn: () => subscriptionApi.getSubscriptions({ status: currentTab, search }),
  });

  const activateMutation = useMutation({
    mutationFn: subscriptionApi.activateSubscription,
    onSuccess: (data) => {
      toast.success('Subscription activated! WhatsApp confirmation dispatched.');
      setActivationResult(data);
      queryClient.invalidateQueries(['subscriptions']);
      queryClient.invalidateQueries(['dashboardStats']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => subscriptionApi.rejectSubscription(id, reason),
    onSuccess: () => {
      toast.success('Payment rejected');
      setInspectingSub(null);
      queryClient.invalidateQueries(['subscriptions']);
    },
  });

  const subsList = result?.data || [];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">₹100 Subscription Verification</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verify UPI payment screenshots, activate 10-day ad-free memberships, and generate credentials.
          </p>
        </div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pending Verification</span>
          <p className="text-2xl font-black text-emerald-900 mt-1">2 Pending</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Subscribers</span>
          <p className="text-2xl font-black text-slate-900 mt-1">1,248</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(124800)}</p>
        </Card>
        <Card>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Access Rule</span>
          <p className="text-xs font-bold text-blue-600 mt-2">₹100 = 3 + 7 = 10 Days</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        {['Pending', 'Activated', 'Rejected', 'Expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              currentTab === tab
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search user, phone, UPI ref..." className="max-w-md" />

      {/* Table */}
      {isLoading ? (
        <Card>
          <p className="text-xs text-slate-400 p-4">Loading subscription data...</p>
        </Card>
      ) : subsList.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No pending subscriptions"
          description="New UPI payment screenshot submissions will appear here for admin review."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">UPI Reference</th>
                  <th className="py-3 px-4">Screenshot</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subsList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.userName}</td>
                    <td className="py-3 px-4 text-slate-600">{sub.userPhone}</td>
                    <td className="py-3 px-4 font-black text-emerald-600">{formatCurrency(sub.amount)}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{sub.upiReference}</td>
                    <td className="py-3 px-4">
                      <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer">
                        <img
                          src={sub.screenshotUrl}
                          alt="UPI Screenshot"
                          onClick={() => setLightboxImage(sub.screenshotUrl)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div
                          onClick={() => setLightboxImage(sub.screenshotUrl)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(sub.submittedDate)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={sub.status === 'Activated' ? 'success' : sub.status === 'Pending' ? 'warning' : 'danger'}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={sub.status === 'Pending' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setInspectingSub(sub)}
                      >
                        {sub.status === 'Pending' ? 'Verify Payment' : 'Inspect'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verification Inspection Modal */}
      {inspectingSub && (
        <Modal
          isOpen={!!inspectingSub}
          onClose={() => {
            setInspectingSub(null);
            setActivationResult(null);
          }}
          title="Subscription Payment Inspection"
          subtitle={`Sub ID: ${inspectingSub.id}`}
        >
          {activationResult ? (
            /* Success Activation Credential Display */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Subscription Activated!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  10-day ad-free access granted. WhatsApp notification dispatched.
                </p>
              </div>

              {/* Backend Generated Credentials Display Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-left space-y-3 font-mono border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Backend Credentials</span>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase">WhatsApp Sent ✓</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                    <span className="text-slate-400">Username:</span>
                    <span className="font-bold text-white text-sm">{activationResult.generatedUsername}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                    <span className="text-slate-400">Password:</span>
                    <span className="font-bold text-white text-sm">{activationResult.generatedPassword}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                    <span className="text-slate-400">Expiry Date:</span>
                    <span className="font-semibold text-emerald-400">{formatDateTime(activationResult.expiryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Copy Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(activationResult.generatedUsername, 'Username')}
                  icon={Copy}
                >
                  Copy Username
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(activationResult.generatedPassword, 'Password')}
                  icon={Copy}
                >
                  Copy Password
                </Button>
              </div>

              <Button
                variant="primary"
                className="w-full py-2.5 font-bold mt-2"
                onClick={() => {
                  setInspectingSub(null);
                  setActivationResult(null);
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            /* Inspection View before activation */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">User Name:</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{inspectingSub.userName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Phone Number:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectingSub.userPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400">UPI Ref / Transaction:</span>
                  <p className="font-mono text-slate-800 font-bold mt-0.5">{inspectingSub.upiReference}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Amount:</span>
                  <p className="font-black text-emerald-600 text-sm mt-0.5">{formatCurrency(inspectingSub.amount)}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Payment Screenshot Preview
                </span>
                <div
                  onClick={() => setLightboxImage(inspectingSub.screenshotUrl)}
                  className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video cursor-pointer group"
                >
                  <img
                    src={inspectingSub.screenshotUrl}
                    alt="Payment"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-xs transition-opacity">
                    Click to Zoom Fullscreen
                  </div>
                </div>
              </div>

              {inspectingSub.status === 'Pending' ? (
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => rejectMutation.mutate({ id: inspectingSub.id, reason: 'Invalid UPI Ref' })}
                    isLoading={rejectMutation.isPending}
                  >
                    Reject Payment
                  </Button>
                  <Button
                    variant="success"
                    className="flex-1 font-bold"
                    onClick={() => activateMutation.mutate(inspectingSub.id)}
                    isLoading={activateMutation.isPending}
                    icon={Sparkles}
                  >
                    Activate Subscription
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 text-right">
                  <Button variant="outline" onClick={() => setInspectingSub(null)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* Lightbox for screenshot */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        images={lightboxImage ? [lightboxImage] : []}
      />
    </div>
  );
};
