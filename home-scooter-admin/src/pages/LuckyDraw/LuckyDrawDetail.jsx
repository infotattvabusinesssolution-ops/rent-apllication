import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { luckyDrawAdminApi } from '../../api/luckyDrawAdminApi';
import { toast } from 'sonner';
import {
  Gift,
  ArrowLeft,
  Clock,
  Ticket,
  Trophy,
  CheckCircle2,
  Lock,
  Play,
  Share2,
  ShieldCheck,
  Award,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';

export const LuckyDrawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: drawData, isLoading, refetch } = useQuery({
    queryKey: ['adminLuckyDrawDetail', id],
    queryFn: () => luckyDrawAdminApi.getDrawById(id),
  });

  const draw = drawData?.data;

  // Status Action Handler
  const handleStatusAction = async (actionType) => {
    try {
      setIsProcessing(true);
      if (actionType === 'CLOSE') {
        await luckyDrawAdminApi.closeDraw(id);
        toast.success('Lucky Draw has been closed and entries are frozen!');
      } else if (actionType === 'RUN_DRAW') {
        await luckyDrawAdminApi.runSystemDraw(id);
        toast.success('System algorithm successfully selected the winner!');
      } else if (actionType === 'VERIFY') {
        await luckyDrawAdminApi.verifyResult(id);
        toast.success('Winner result verified by Admin!');
      } else if (actionType === 'PUBLISH_RESULT') {
        await luckyDrawAdminApi.publishResult(id);
        toast.success('Winner officially published to all users!');
      }
      queryClient.invalidateQueries(['adminLuckyDrawDetail', id]);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Loading Lucky Draw details...</div>;
  }

  if (!draw) {
    return <div className="p-12 text-center text-slate-500 text-sm">Lucky Draw campaign not found.</div>;
  }

  const result = draw.result;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lucky-draw')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{draw.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                {draw.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Created: {new Date(draw.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {draw.status === 'ACTIVE' && (
            <button
              onClick={() => handleStatusAction('CLOSE')}
              disabled={isProcessing}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-4 h-4" /> Close Draw
            </button>
          )}

          {draw.status === 'CLOSED' && (
            <button
              onClick={() => handleStatusAction('RUN_DRAW')}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              <Play className="w-4 h-4 fill-white" /> Run System Draw
            </button>
          )}

          {draw.status === 'WINNER_SELECTED' && (
            <button
              onClick={() => handleStatusAction('VERIFY')}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" /> Verify Result
            </button>
          )}

          {draw.status === 'VERIFIED' && (
            <button
              onClick={() => handleStatusAction('PUBLISH_RESULT')}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 shadow-xs"
            >
              <Share2 className="w-4 h-4" /> Publish Winner
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Entry Price</p>
          <p className="text-xl font-black text-slate-900 mt-1">₹{draw.entryPrice}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Entries Sold</p>
          <p className="text-xl font-black text-purple-700 mt-1">
            {draw.totalEntries} / {draw.maxEntries}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Prizes Configured</p>
          <p className="text-xl font-black text-slate-900 mt-1">{draw.prizes ? draw.prizes.length : 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold">Draw Date</p>
          <p className="text-sm font-bold text-slate-900 mt-1">{new Date(draw.drawDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* WINNER RESULT DISPLAY SCREEN */}
      {result && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4 border border-purple-500/30">
          <div className="flex items-center justify-between border-b border-purple-700/50 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-base font-bold tracking-wide text-amber-300 uppercase">
                System Winner Selection Result
              </h2>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full uppercase">
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-purple-300">Total Eligible Snapshot Entries:</p>
              <p className="text-lg font-black text-white">{result.totalEligibleEntries.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-purple-300">Random Generation Provider:</p>
              <p className="font-mono text-purple-200">{result.randomProvider} ({result.randomReference})</p>
            </div>
            <div className="md:col-span-2 bg-purple-950/60 p-2.5 rounded-lg border border-purple-700/40 font-mono text-[11px] break-all">
              <span className="text-purple-400 font-sans font-bold block mb-0.5">Verification Hash (SHA-256):</span>
              {result.verificationHash}
            </div>
          </div>

          {/* Winners List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Winning Tickets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.winners.map((w, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">{w.prizeTitle || 'Winner Prize'}</span>
                    <span className="font-mono font-bold text-white bg-purple-600/80 px-2 py-0.5 rounded-md">
                      {w.ticketNumber}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{w.userName || 'Participant'}</p>
                  <p className="text-xs text-purple-200">Phone: {w.userPhone || 'Registered User'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prizes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Configured Prizes</h2>
          <Link to={`/lucky-draw/${draw._id}/entries`} className="text-xs font-bold text-purple-600">
            View All Entry Tickets →
          </Link>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-100">
              <th className="px-6 py-3">Rank</th>
              <th className="px-4 py-3">Prize Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Winners Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {draw.prizes && draw.prizes.length > 0 ? (
              draw.prizes.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-bold text-purple-700">Rank #{p.rank}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 text-slate-600">{p.prizeType}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">₹{p.prizeValue}</td>
                  <td className="px-4 py-3 text-slate-700">{p.winnersRequired || p.quantity || 1}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-slate-400">
                  No prizes added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
