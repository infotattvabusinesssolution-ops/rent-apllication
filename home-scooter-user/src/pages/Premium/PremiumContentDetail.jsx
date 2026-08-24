import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { premiumUserApi } from '../../api/premiumUserApi';
import { premiumAuthStorage } from '../../utils/premiumAuthStorage';
import { ArrowLeft, Calendar, FileText, Sparkles, ShieldCheck, Crown } from 'lucide-react';

export const PremiumContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = premiumAuthStorage.getToken();

  if (!token) {
    navigate('/premium/login', { replace: true });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['premiumUserContentDetail', id],
    queryFn: () => premiumUserApi.getPremiumContentById(id),
    enabled: Boolean(id && token),
  });

  const content = data?.data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/premium/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Premium Dashboard
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : isError || !content ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-sm font-bold text-rose-600">
              {error?.response?.data?.message || 'Premium Content not found or expired'}
            </p>
            <Link to="/premium/dashboard" className="text-xs font-bold text-blue-600 hover:underline">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Header */}
            <div className="space-y-3 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    content.contentType === 'VIDEO'
                      ? 'bg-purple-100 text-purple-700'
                      : content.contentType === 'BANNER'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {content.contentType}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                  <Crown className="w-3.5 h-3.5" /> Premium Verified Content
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {content.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Published on {new Date(content.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Media Player / Banner Image */}
            {content.contentType !== 'TEXT' && content.mediaUrl && (
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                {content.contentType === 'VIDEO' ? (
                  <video
                    src={content.mediaUrl}
                    controls
                    autoPlay
                    className="w-full max-h-[480px] object-contain"
                  />
                ) : (
                  <img
                    src={content.mediaUrl}
                    alt={content.title}
                    className="w-full max-h-[500px] object-contain"
                  />
                )}
              </div>
            )}

            {/* Content Body */}
            {content.description && (
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-normal">
                {content.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
