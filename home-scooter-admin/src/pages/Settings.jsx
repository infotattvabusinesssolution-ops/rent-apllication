import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, ShieldCheck, Bell, CreditCard, Lock, Save } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [adminName, setAdminName] = useState(user?.name || 'Rahul Sharma');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@homescooter.com');
  const [autoApproveVerified, setAutoApproveVerified] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState(100);
  const [subscriptionDays, setSubscriptionDays] = useState(10);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsAppDispatch, setWhatsAppDispatch] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Admin Portal settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Admin Portal Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage system configurations, moderation thresholds, subscription rules, and admin profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs Column */}
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Admin Profile', icon: User },
            { id: 'moderation', label: 'Moderation Rules', icon: ShieldCheck },
            { id: 'subscription', label: 'Subscription Settings', icon: CreditCard },
            { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
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

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Mandatory Image Moderation</p>
                        <p className="text-[11px] text-slate-500">Require at least 1 image for all layout and scooter listings</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
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
                      <p className="text-[10px] text-slate-400 mt-1">Rule: 3 + 7 = 10 Days total ad-free access</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <CardHeader title="System Notifications & Dispatches" subtitle="Configure email & WhatsApp alert dispatchers" />

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900">WhatsApp Credential Dispatch</p>
                        <p className="text-[11px] text-slate-500">Automatically send generated credentials via WhatsApp API on activation</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={whatsAppDispatch}
                        onChange={(e) => setWhatsAppDispatch(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Admin Email Notifications</p>
                        <p className="text-[11px] text-slate-500">Send email digests for new reported listings</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </label>
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
                      Super admins can perform all actions including approving ads, verifying ₹100 payments, managing users, creating banner campaigns and modifying portal settings.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" icon={Save} className="font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
