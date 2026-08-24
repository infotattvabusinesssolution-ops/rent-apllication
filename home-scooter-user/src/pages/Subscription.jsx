import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Award,
  MessageSquare,
  Ban,
  Star,
  Key,
  ThumbsUp,
} from 'lucide-react';
import { toast } from 'sonner';

export const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch live Admin payment settings (QR Code, UPI ID, price, WhatsApp)
  const { data: settingsData } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get('/v1/user/settings');
        return res;
      } catch (e) {
        return {
          paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100',
          upiId: 'rentapp@upi',
          subscriptionPrice: 100,
          dealerWhatsapp: '+91 98765 43210',
        };
      }
    },
  });

  const paymentQrCodeUrl = settingsData?.paymentQrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rentapp@upi%26pn=Home%20And%20Scooter%26am=100';
  const upiId = settingsData?.upiId || 'rentapp@upi';
  const price = settingsData?.subscriptionPrice || 100;
  const whatsappNum = settingsData?.dealerWhatsapp || '+91 98765 43210';

  const handleWhatsAppSend = () => {
    const cleanNum = whatsappNum.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello Admin, I have completed the subscription payment of ₹${price}/-. User: ${user?.name || 'Guest'} (${user?.phone || 'No phone'}). Please activate my account facilities.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-5 pb-20 max-w-lg mx-auto px-2 sm:px-0 font-serif">
      {/* Header Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Subscription Model
        </h1>
      </div>

      {/* Member Exclusive Card (Vibrant Blue) */}
      <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-md shadow-blue-500/20 space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <Award className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>MEMBER EXCLUSIVE</span>
        </div>

        <h2 className="text-2xl font-bold leading-tight">
          Become a Subscriber for Just ₹{price}/-
        </h2>

        <p className="text-blue-100 text-xs font-light">
          Enjoy exclusive benefits and stay connected with us.
        </p>
      </div>

      {/* How to Subscribe Section */}
      <div className="space-y-4 pt-1">
        <h3 className="font-bold text-slate-900 text-lg">How to Subscribe:</h3>

        {/* Step 1 Card: Scan QR Code */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm leading-snug pt-0.5">
              Pay the subscription fee of ₹{price}/- by scanning our QR Code.
            </h4>
          </div>

          {/* QR Code Container */}
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-3xl p-5 text-center space-y-3">
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto border border-slate-200/80 shadow-sm flex items-center justify-center">
              <img
                src={paymentQrCodeUrl}
                alt="Payment QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <p className="text-slate-600 font-bold text-xs">
                Scan with GPay, PhonePe, Paytm or any UPI App
              </p>
              <p className="text-blue-600 font-bold text-xs">
                UPI ID: {upiId} • Amount: ₹{price}/-
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 Card: WhatsApp Screenshot Confirmation */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm leading-snug pt-0.5">
              After payment, send the payment screenshot via WhatsApp for confirmation.
            </h4>
          </div>

          <button
            onClick={handleWhatsAppSend}
            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <MessageSquare className="w-5 h-5 fill-white text-[#16a34a]" />
            <span>Send Payment Screenshot on WhatsApp</span>
          </button>
        </div>

        {/* Step 3 Card: Activation Credentials */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm leading-snug pt-0.5">
              Once your subscription is activated, you will receive your Username & Password to access the subscribed member facilities.
            </h4>
          </div>
        </div>
      </div>

      {/* Subscriber Benefits Section */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-slate-900 text-lg">Subscriber Benefits:</h3>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs divide-y divide-slate-100 space-y-3">
          {/* Benefit 1 */}
          <div className="flex items-center gap-4 pt-1">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">
              Advertisement-Free Access for 3 + 7 Days
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="flex items-center gap-4 pt-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
            </div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">
              Access to exclusive subscriber facilities and benefits
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="flex items-center gap-4 pt-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
              Details of additional benefits, updates, and special offers will be communicated directly through WhatsApp
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="flex items-center gap-4 pt-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
              Personal Username & Password will be provided to every subscribed member.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Callout Banner */}
      <div className="bg-[#eff6ff] border border-blue-200/80 rounded-2xl p-4 flex items-center gap-3">
        <ThumbsUp className="w-6 h-6 text-blue-600 fill-blue-600 shrink-0" />
        <p className="text-blue-900 font-bold text-xs sm:text-sm leading-snug">
          Subscribe today and enjoy a better, more convenient experience!
        </p>
      </div>
    </div>
  );
};
