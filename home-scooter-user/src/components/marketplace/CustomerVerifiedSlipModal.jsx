import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { callbackApi } from '../../api/callbackApi';
import { toast } from 'sonner';
import { X, Send } from 'lucide-react';

export const CustomerVerifiedSlipModal = ({ isOpen, onClose, ad }) => {
  const { user, selectedLocation } = useAuth();

  // Form Fields State
  const [productRequired, setProductRequired] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPlace, setCustomerPlace] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');

  useEffect(() => {
    if (ad) {
      setProductRequired(ad.title || 'MUDA Approved Layout Sites in Mysore');
    }
    setCustomerName(user?.name || 'Gyan123priya');
    setCustomerPlace(selectedLocation || 'Bangalore, Karnataka');
    setCustomerContact(user?.phone || user?.email || 'gyan123priya@gmail.com');
    setCustomerWhatsapp(user?.phone || user?.email || 'gyan123priya@gmail.com');
  }, [ad, user, selectedLocation]);

  if (!isOpen || !ad) return null;

  const dealerName = ad.posterName || 'MUDA Layout Developers';
  const dealerPhone = ad.posterPhone || '8951285146';
  const dealerWhatsapp = dealerPhone.startsWith('+') ? dealerPhone : `+91 ${dealerPhone}`;

  const handleSendToWhatsapp = async () => {
    try {
      // Trigger callback API in backend
      await callbackApi.requestCallback(ad.id);
    } catch (e) {
      console.log('Callback log failed, continuing to WhatsApp');
    }

    const message = `*CUSTOMER VERIFIED SLIP (CVS)*

1) *Product / Service Required:* ${productRequired}
2) *Name:* ${customerName}
3) *Place:* ${customerPlace}
4) *Contact Number:* ${customerContact}
5) *Whatsapp Number:* ${customerWhatsapp}

*SENT TO DEALER:*
6) *Dealer Name:* ${dealerName}
7) *Contact Number:* ${dealerPhone}
8) *Whatsapp Number:* ${dealerWhatsapp}`;

    const cleanNumber = dealerPhone.replace(/[^0-9]/g, '');
    const targetNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    toast.success('Verified Slip created & WhatsApp opened!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      {/* Backdrop overlay click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Bottom Sheet Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-100 max-h-[90vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle pill & Close Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CUSTOMER VERIFIED SLIP (CVS) Header Banner */}
        <div className="bg-[#0038a8] text-white text-center py-3.5 px-4 rounded-2xl font-serif font-bold text-sm sm:text-base shadow-sm uppercase tracking-wide mb-5">
          CUSTOMER VERIFIED SLIP (CVS)
        </div>

        {/* Form Fields List */}
        <div className="space-y-4">
          {/* Field 1: Product / Service Required */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              1) Product / Service Required
            </label>
            <input
              type="text"
              value={productRequired}
              onChange={(e) => setProductRequired(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Field 2: Name */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              2) Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Field 3: Place */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              3) Place
            </label>
            <input
              type="text"
              value={customerPlace}
              onChange={(e) => setCustomerPlace(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Field 4: Contact Number */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              4) Contact Number
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Field 5: Whatsapp Number */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              5) Whatsapp Number
            </label>
            <input
              type="text"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* SENT TO Badge Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-[#0038a8] text-white font-serif font-bold text-xs uppercase px-5 py-1.5 rounded-full tracking-wider shadow-sm">
              SENT TO
            </span>
          </div>

          {/* Field 6: Dealer Name */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              6) Dealer Name
            </label>
            <div className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm">
              {dealerName}
            </div>
          </div>

          {/* Field 7: Contact Number */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              7) Contact Number
            </label>
            <div className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm">
              {dealerPhone}
            </div>
          </div>

          {/* Field 8: Whatsapp Number */}
          <div>
            <label className="font-serif font-bold text-blue-950 text-xs sm:text-sm mb-1.5 block">
              8) Whatsapp Number
            </label>
            <div className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 font-serif font-bold text-slate-800 text-sm">
              {dealerWhatsapp}
            </div>
          </div>

          {/* Primary Action Button: SEND TO WHATSAPP */}
          <button
            onClick={handleSendToWhatsapp}
            className="w-full bg-[#10a34a] hover:bg-emerald-700 active:scale-[0.99] text-white font-serif font-bold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-6"
          >
            <Send className="w-5 h-5 fill-white text-white" />
            <span>SEND TO WHATSAPP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
