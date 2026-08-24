import React, { useState, useEffect } from 'react';
import { X, Gift, Send, Sparkles, Phone, User, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { luckyDrawUserApi } from '../../api/luckyDrawUserApi';
import { useAuth } from '../../context/AuthContext';

export const LuckyDrawInterestModal = ({ isOpen, onClose, ad }) => {
  const { user } = useAuth();

  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorDetails, setVisitorDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setVisitorName(user.name || user.fullName || '');
        setVisitorPhone(user.phone || user.phoneNumber || '');
        setVisitorEmail(user.email || '');
      }
      setVisitorDetails('');
    }
  }, [isOpen, user]);

  if (!isOpen || !ad) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!visitorPhone.trim()) {
      toast.error('Please enter your WhatsApp / Phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const adId = ad.id || ad.adId || 'AD-1001';
      const adTitle = ad.title || 'Product / Service Listing';
      const adCategory = ad.category || 'General';
      const adImageUrl = ad.imageUrls && ad.imageUrls.length > 0 ? ad.imageUrls[0] : '';

      // 1. Submit to Backend API
      const res = await luckyDrawUserApi.submitEnquiry({
        adId,
        adTitle,
        adCategory,
        adImageUrl,
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim(),
        visitorEmail: visitorEmail.trim(),
        visitorDetails: visitorDetails.trim(),
      });

      const adminPhone = res?.adminPhone || '+91 98765 43210';
      const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
      const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

      // 2. Format WhatsApp Notification Message
      const waMessage =
        `🎁 *LUCKY DRAW ENQUIRY RECEIVED* 🎁\n` +
        `-----------------------------------\n` +
        `📢 *Listing:* ${adTitle}\n` +
        `🆔 *Ad ID:* #${adId}\n` +
        `🏷️ *Category:* ${adCategory}\n` +
        (adImageUrl ? `🖼️ *Ad Image:* ${adImageUrl}\n` : '') +
        `-----------------------------------\n` +
        `👤 *Visitor Name:* ${visitorName.trim()}\n` +
        `📞 *Contact Number:* ${visitorPhone.trim()}\n` +
        (visitorEmail.trim() ? `✉️ *Email:* ${visitorEmail.trim()}\n` : '') +
        (visitorDetails.trim() ? `📝 *Notes/City:* ${visitorDetails.trim()}\n` : '') +
        `⏰ *Date & Time:* ${new Date().toLocaleString()}\n` +
        `-----------------------------------\n` +
        `👉 *I am interested to know more about this Lucky Draw offer!*`;

      // 3. Open Admin WhatsApp
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;
      window.open(whatsappUrl, '_blank');

      toast.success('Lucky Draw enquiry submitted! Connecting to Admin WhatsApp...');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const adImage = ad.imageUrls && ad.imageUrls.length > 0
    ? ad.imageUrls[0]
    : 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header Ribbon / Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Gift className="w-7 h-7 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-400/30 text-amber-200 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300/40 mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Lucky Draw Active
              </div>
              <h2 className="font-serif font-black text-xl leading-tight">
                I am Interested to Know More
              </h2>
            </div>
          </div>
        </div>

        {/* Selected Ad Preview Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <img
            src={adImage}
            alt={ad.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
              {ad.category || 'Product / Service'}
            </span>
            <h4 className="font-serif font-bold text-slate-900 text-sm truncate">
              {ad.title}
            </h4>
            <p className="text-xs font-black text-blue-600 mt-0.5">
              ₹{ad.price ? Number(ad.price).toLocaleString() : 'Special Offer'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <p className="text-slate-600 text-xs font-serif leading-relaxed">
            Fill out your details below to participate in the Lucky Draw for this listing and receive details directly on Admin WhatsApp.
          </p>

          {/* Visitor Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-500" />
              <span>Full Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>

          {/* WhatsApp / Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp / Contact Phone <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Email Address <span className="text-slate-400 text-[10px] font-normal">(Optional)</span></span>
            </label>
            <input
              type="email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* City / Location & Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              <span>Location / Enquiry Message <span className="text-slate-400 text-[10px] font-normal">(Optional)</span></span>
            </label>
            <textarea
              rows={2}
              value={visitorDetails}
              onChange={(e) => setVisitorDetails(e.target.value)}
              placeholder="e.g. Mysuru, interested in plot booking details..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-serif font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-4 h-4 fill-white/20" />
              <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit & Connect on WhatsApp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
