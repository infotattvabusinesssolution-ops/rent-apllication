import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { educationUserApi } from '../../api/educationUserApi';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Eye,
  FileDown,
  ExternalLink,
  Video,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

export const EducationContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['educationContentDetail', id],
    queryFn: () => educationUserApi.getContentById(id),
  });

  const item = data?.data;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.shortDescription || item?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <p className="text-sm font-bold text-slate-700">Educational Update Not Found</p>
        <button
          onClick={() => navigate('/education/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button & Share */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Content Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700">
                {item.category?.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                Target: {item.targetAudience}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {item.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                {item.viewsCount || 1} Views
              </span>
            </div>
          </div>

          {/* Media Player / Image / Document / Link Component */}

          {/* 1. VIDEO TYPE */}
          {item.contentType === 'VIDEO' && item.mediaUrl && (
            <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                src={item.mediaUrl}
                controls
                autoPlay
                className="w-full max-h-[450px] object-contain"
              />
            </div>
          )}

          {/* 2. BANNER IMAGE TYPE */}
          {item.contentType === 'BANNER' && item.mediaUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[450px] flex justify-center bg-slate-100 shadow-xs">
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* 3. DOCUMENT (PDF) TYPE */}
          {item.contentType === 'DOCUMENT' && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-amber-600" />
                  PDF Attachment Document Available
                </p>
                <p className="text-xs text-amber-700">Official document notice ready for download.</p>
              </div>

              {item.documentUrl && (
                <a
                  href={item.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-colors"
                >
                  <FileDown className="w-4 h-4" /> Download PDF Document
                </a>
              )}
            </div>
          )}

          {/* 4. EXTERNAL LINK TYPE */}
          {item.contentType === 'LINK' && item.externalUrl && (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-blue-900 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  Official External Website Portal
                </p>
                <p className="text-xs text-blue-700 truncate max-w-md">{item.externalUrl}</p>
              </div>

              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-colors"
              >
                Open External Portal <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Text Description Body */}
          {item.description && (
            <div className="prose max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line space-y-4 pt-2">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
