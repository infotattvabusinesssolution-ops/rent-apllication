import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { visitorWinApi } from '../api/visitorWinApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { toast } from 'sonner';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

export const VisitorWin = () => {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Layout Plots & Land');
  const [isSuccess, setIsSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: visitorWinApi.register,
    onSuccess: (res) => {
      toast.success(res.message);
      setIsSuccess(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !place) {
      toast.error('Please complete all required fields');
      return;
    }
    registerMutation.mutate({ name, place, age: Number(age), phone, subjectInterest: subject });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 rounded-3xl p-8 text-white text-center space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md">
          <Trophy className="w-4 h-4 text-amber-300" /> Visitor Win Event 2026
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Register for Opportunity to Participate</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto font-medium leading-relaxed">
          Enter your details below to register for the Home & Scooter promotional event contest. Winners are announced every month!
        </p>
      </div>

      {/* Registration Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Registration Successful!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Thank you for registering in Visitor Win 2026. Our team will contact you via WhatsApp for upcoming contest updates.
            </p>
            <Button onClick={() => setIsSuccess(false)} variant="outline">
              Register Another Participant
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gyana Prakash"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Place / Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g. Hoskote, Bangalore"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject of Interest
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Layout Plots & Land">Layout Plots & Land</option>
                <option value="Houses & Rental Flats">Houses & Rental Flats</option>
                <option value="Electric Scooters (EV)">Electric Scooters (EV)</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Commercial Real Estate">Commercial Real Estate</option>
              </select>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="success"
                size="lg"
                className="w-full font-black"
                isLoading={registerMutation.isPending}
                icon={Sparkles}
              >
                Submit Event Registration
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
