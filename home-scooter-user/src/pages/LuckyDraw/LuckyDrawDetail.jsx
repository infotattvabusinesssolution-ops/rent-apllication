import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { luckyDrawUserApi } from '../../api/luckyDrawUserApi';
import { CountdownTimer } from '../../components/LuckyDraw/CountdownTimer';
import { EntrySelector } from '../../components/LuckyDraw/EntrySelector';
import { toast } from 'sonner';
import {
  Gift,
  ArrowLeft,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const LuckyDrawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);

  const { data: drawData, isLoading, refetch } = useQuery({
    queryKey: ['userLuckyDrawDetail', id],
    queryFn: () => luckyDrawUserApi.getDrawById(id),
  });

  const draw = drawData?.data;

  const handleBuyEntries = async (quantity) => {
    try {
      setIsOrdering(true);
      const res = await luckyDrawUserApi.createOrder(draw._id, quantity);
      const orderData = res.data;

      // Simulate payment checkout verification (Client verification flow)
      toast.info('Simulating payment checkout verification...');

      const verifyRes = await luckyDrawUserApi.verifyPayment({
        orderId: orderData.orderId,
        gatewayPaymentId: `pay_${Date.now()}`,
      });

      toast.success(`Success! Generated ${quantity} unique Lucky Draw ticket(s)!`);
      refetch();
      navigate('/lucky-draw/payment/success', {
        state: { order: verifyRes.data?.order, tickets: verifyRes.data?.entries },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment initialization failed');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return <div className="p-16 text-center text-slate-400 text-sm">Loading Lucky Draw details...</div>;
  }

  if (!draw) {
    return <div className="p-16 text-center text-slate-500 text-sm">Lucky Draw campaign not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/lucky-draw')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Lucky Draws
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="relative h-64 md:h-80 w-full">
          {draw.bannerImage || draw.thumbnailImage ? (
            <img src={draw.bannerImage || draw.thumbnailImage} alt={draw.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-purple-900 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 md:p-8 space-y-2">
            <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider w-max">
              {draw.status}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{draw.title}</h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl">
              {draw.shortDescription || 'Enter now for a chance to win exclusive platform rewards.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details & Prizes & Rules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prizes Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Configured Prizes
            </h2>

            <div className="space-y-3">
              {draw.prizes && draw.prizes.length > 0 ? (
                draw.prizes.map((prize) => (
                  <div key={prize._id} className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                        Rank #{prize.rank} Prize
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{prize.title}</h3>
                      <p className="text-xs text-slate-500">{prize.description || `${prize.prizeType} Reward`}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-purple-800">₹{prize.prizeValue}</span>
                      <span className="text-[10px] text-slate-400 block">{prize.winnersRequired || 1} Winner(s)</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Prizes will be announced shortly.</p>
              )}
            </div>
          </div>

          {/* User's Existing Tickets */}
          {draw.userTickets && draw.userTickets.length > 0 && (
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-3">
              <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Your Purchased Tickets ({draw.userTickets.length})
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {draw.userTickets.map((t, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs font-bold bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-lg"
                  >
                    {t.ticketNumber}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Terms */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Rules & Terms</h3>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              {draw.rules && draw.rules.length > 0 ? (
                draw.rules.map((r, idx) => <li key={idx}>{r}</li>)
              ) : (
                <>
                  <li>Each paid entry generates one unique valid ticket number.</li>
                  <li>Winner is automatically selected by cryptographically secure algorithm.</li>
                  <li>Admin cannot manually choose or alter the winner.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Entry Selector & Countdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Time Remaining</span>
            <CountdownTimer targetDate={draw.endDate} />
          </div>

          {/* Entry Purchase Box */}
          {draw.status === 'ACTIVE' ? (
            <EntrySelector
              entryPrice={draw.entryPrice}
              maxEntriesPerUser={draw.maxEntriesPerUser}
              userExistingEntriesCount={draw.userEntriesCount || 0}
              onBuyEntries={handleBuyEntries}
              isSubmitting={isOrdering}
            />
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />
              <h3 className="font-bold text-sm">Entries Are Currently Closed</h3>
              <p className="text-xs text-amber-700">
                This draw is {draw.status}. Stay tuned for winner verification or upcoming draws!
              </p>
            </div>
          )}

          {/* System Automated Selection Guarantee */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-xs">100% Automated System Selection</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Our platform uses a cryptographically secure random selection algorithm (CSRNG) to pick winners. Admin manual selection is impossible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
