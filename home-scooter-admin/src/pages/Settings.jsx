import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { settingsApi } from '../api/settingsApi';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, ShieldCheck, PhoneCall, CreditCard, Lock, Save, Upload } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dealer');

  const [adminName, setAdminName] = useState(user?.name || 'Rahul Sharma');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@homescooter.com');
  const [dealerName, setDealerName] = useState('Hoskote Realties');
  const [dealerPhone, setDealerPhone] = useState('+91 98765 43210');
  const [dealerWhatsapp, setDealerWhatsapp] = useState('+91 98765 43210');
  const [paymentQrCodeUrl, setPaymentQrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100');
  const [upiId, setUpiId] = useState('rentapp@upi');
  const [autoApproveVerified, setAutoApproveVerified] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(100);
  const [subscriptionDays, setSubscriptionDays] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  const handleQrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingQr(true);
    try {
      const res = await settingsApi.uploadQrCode(file);
      if (res?.success && res?.paymentQrCodeUrl) {
        setPaymentQrCodeUrl(res.paymentQrCodeUrl);
        toast.success('Payment QR Code uploaded to Cloudinary CDN successfully!');
      } else {
        toast.error(res?.message || 'Cloudinary upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploadingQr(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await settingsApi.getSettings();
      if (res?.settings) {
        if (res.settings.dealerName) setDealerName(res.settings.dealerName);
        if (res.settings.dealerPhone) setDealerPhone(res.settings.dealerPhone);
        if (res.settings.dealerWhatsapp) setDealerWhatsapp(res.settings.dealerWhatsapp);
        if (res.settings.paymentQrCodeUrl) setPaymentQrCodeUrl(res.settings.paymentQrCodeUrl);
        if (res.settings.upiId) setUpiId(res.settings.upiId);
        if (res.settings.autoApproveVerified !== undefined) setAutoApproveVerified(res.settings.autoApproveVerified);
        if (res.settings.subscriptionPrice) setSubscriptionPrice(res.settings.subscriptionPrice);
        if (res.settings.subscriptionDays) setSubscriptionDays(res.settings.subscriptionDays);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        dealerName: dealerName.trim(),
        dealerPhone: dealerPhone.trim(),
        dealerWhatsapp: dealerWhatsapp.trim(),
        paymentQrCodeUrl: paymentQrCodeUrl.trim(),
        upiId: upiId.trim(),
        autoApproveVerified,
        subscriptionPrice,
        subscriptionDays,
      };

      const res = await settingsApi.updateSettings(payload);
      if (res?.success) {
        toast.success(res.message || 'Admin Portal & Dealer settings saved successfully! Reflected on User side.');
      } else {
        toast.error(res?.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.error('Error saving portal settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Admin Portal Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage system configurations, Customer Verified Slip (CVS) dealer details, subscription rules, and admin profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="space-y-1">
          {[
            { id: 'dealer', label: 'Dealer & Customer Slip (CVS)', icon: PhoneCall },
            { id: 'profile', label: 'Admin Profile', icon: User },
            { id: 'moderation', label: 'Moderation Rules', icon: ShieldCheck },
            { id: 'subscription', label: 'Subscription Settings', icon: CreditCard },
            { id: 'security', label: 'Security & Roles', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content Column */}
        <div className="lg:col-span-3">
          <Card>
            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === 'dealer' && (
                <div className="space-y-4">
                  <CardHeader
                    title="Dealer & Customer Verified Slip (CVS) Configuration"
                    subtitle="Set the default Dealer Name, Contact Number, and WhatsApp Number that will reflect on the User application CVS slip page."
                  />

                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
                    <p className="text-xs font-bold text-blue-900">User App Synchronization</p>
                    <p className="text-[11px] text-blue-700 leading-relaxed font-serif">
                      The details configured here will immediately populate fields 6 (Dealer Name), 7 (Contact Number), and 8 (WhatsApp Number) under <strong>SENT TO</strong> on the user application Customer Verified Slip modal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Field 1: Dealer Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        6) Dealer Name (Reflected on User Side)
                      </label>
                      <input
                        type="text"
                        value={dealerName}
                        onChange={(e) => setDealerName(e.target.value)}
                        placeholder="e.g. Hoskote Realties"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                        required
                      />
                    </div>

                    {/* Field 2: Contact Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        7) Contact Number (Reflected on User Side)
                      </label>
                      <input
                        type="text"
                        value={dealerPhone}
                        onChange={(e) => setDealerPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                        required
                      />
                    </div>

                    {/* Field 3: WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        8) WhatsApp Number (Reflected on User Side)
                      </label>
                      <input
                        type="text"
                        value={dealerWhatsapp}
                        onChange={(e) => setDealerWhatsapp(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                        required
                      />
                    </div>

                    {/* Field 4: Payment UPI ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        9) Subscription UPI ID (Reflected on User Subscription Screen)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. rentapp@upi"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:bg-white focus:border-blue-600 outline-none"
                        required
                      />
                    </div>

                    {/* Field 5: Payment QR Code URL with Cloudinary Upload */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        10) Payment QR Code Image (Cloudinary CDN)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={paymentQrCodeUrl}
                          onChange={(e) => setPaymentQrCodeUrl(e.target.value)}
                          placeholder="Cloudinary Image URL (https://res.cloudinary.com/...)"
                          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                          required
                        />
                        <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-sm">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>{isUploadingQr ? 'Uploading to Cloudinary...' : 'Upload QR Image to Cloudinary'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrFileChange}
                            className="hidden"
                            disabled={isUploadingQr}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live QR Code Preview Box */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4">
                      <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0">
                        <img src={paymentQrCodeUrl} alt="QR Code Preview" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Live User Side QR Preview</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">UPI ID: {upiId}</p>
                        <p className="text-[10px] text-emerald-400 font-bold mt-1">Reflects automatically on user subscription page</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <CardHeader title="Admin Profile & Account" subtitle="Update your administrator credentials and avatar" />

                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{user?.name}</h4>
                      <Badge variant="purple" className="mt-1">{user?.role || 'SUPER_ADMIN'}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Admin Email Address
                      </label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'moderation' && (
                <div className="space-y-4">
                  <CardHeader title="Marketplace Moderation Rules" subtitle="Automated moderation thresholds and review policies" />

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Auto-approve Verified Sellers</p>
                        <p className="text-[11px] text-slate-500">Allow verified seller ads to bypass pending queue</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoApproveVerified}
                        onChange={(e) => setAutoApproveVerified(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="space-y-4">
                  <CardHeader title="₹100 Subscription Rules" subtitle="Pricing and free posting period configuration" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Subscription Price (INR ₹)
                      </label>
                      <input
                        type="number"
                        value={subscriptionPrice}
                        onChange={(e) => setSubscriptionPrice(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Access Duration (Days)
                      </label>
                      <input
                        type="number"
                        value={subscriptionDays}
                        onChange={(e) => setSubscriptionDays(Number(e.target.value))}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        UPI ID (Reflected on User Subscription Page)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. rentapp@upi"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Payment QR Code Image (Cloudinary CDN)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={paymentQrCodeUrl}
                          onChange={(e) => setPaymentQrCodeUrl(e.target.value)}
                          placeholder="Cloudinary Image URL (https://res.cloudinary.com/...)"
                          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                          required
                        />
                        <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 shadow-sm">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>{isUploadingQr ? 'Uploading to Cloudinary...' : 'Upload QR Image to Cloudinary'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrFileChange}
                            className="hidden"
                            disabled={isUploadingQr}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <CardHeader title="Security & Role-Based Access Control" subtitle="Role definitions and admin security policies" />

                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold">SUPER_ADMIN Role</span>
                      <Badge variant="purple">Full Access</Badge>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Super admins can configure dealer slip settings, approve ads, verify ₹100 payments, manage users, create banner campaigns and modify portal settings.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" icon={Save} loading={isSaving} className="font-bold">
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
