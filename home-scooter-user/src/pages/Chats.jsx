import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Search, MessageSquare } from 'lucide-react';

export const Chats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = user?.id || user?.userId || 'USR-8821';

  // Fetch live chats from MongoDB
  const { data: chatsResult, isLoading } = useQuery({
    queryKey: ['userChats', currentUserId],
    queryFn: () => chatApi.getChats(currentUserId),
    refetchInterval: 3000, // Real-time polling backup
  });

  // Connect Real-time Socket Event Stream via Server-Sent Events
  useEffect(() => {
    let eventSource = null;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5027';
      eventSource = new EventSource(`${apiBase.replace(/\/+$/, '')}/api/v1/user/chats/events`);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'chat:new-message' || parsed.event === 'chat:created') {
            queryClient.invalidateQueries(['userChats', currentUserId]);
          }
        } catch (e) {}
      };
    } catch (err) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [currentUserId, queryClient]);

  const rawChats = chatsResult?.chats || [];

  // Initial seed fallback chats if database is fresh
  const sampleChats = rawChats.length > 0 ? rawChats : [
    {
      id: 'CHAT-10291',
      chatId: 'CHAT-10291',
      otherPartyName: 'Hoskote Realties',
      adTitle: 'Premium Layout Site',
      lastMessage: 'Is the Hoskote layout site still available for visit?',
      lastMessageAt: '10:42 AM',
      unreadCount: 2,
      icon: '🗺️',
    },
    {
      id: 'CHAT-10292',
      chatId: 'CHAT-10292',
      otherPartyName: 'Whitefield Builders',
      adTitle: '2 BHK Apartment',
      lastMessage: 'Yes, the 2 BHK flat is available for visit tomorrow.',
      lastMessageAt: 'Yesterday',
      unreadCount: 0,
      icon: '🏢',
    },
    {
      id: 'CHAT-10293',
      chatId: 'CHAT-10293',
      otherPartyName: 'E-Rider Rentals',
      adTitle: 'Electric Scooter',
      lastMessage: 'Battery range is 140 km on single full charge.',
      lastMessageAt: '2 days ago',
      unreadCount: 0,
      icon: '🛵',
    },
  ];

  const filteredChats = sampleChats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.otherPartyName || '').toLowerCase().includes(q) ||
      (c.adTitle || '').toLowerCase().includes(q) ||
      (c.lastMessage || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto px-2 sm:px-0 font-serif">
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
          Messages & Chats
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search buyer & seller chats..."
          className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-light text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
        />
      </div>

      {/* Chat List Items */}
      <div className="space-y-3 pt-1">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
          ))
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-bold text-sm">No chats found</p>
            <p className="text-slate-400 text-xs mt-1">
              Start an inquiry on any ad to message sellers in real-time
            </p>
          </div>
        ) : (
          filteredChats.map((c) => {
            const chatId = c.chatId || c.id;
            return (
              <div
                key={chatId}
                onClick={() => navigate(`/chats/${chatId}`)}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              >
                {/* Left Avatar Icon Box */}
                <div className="w-14 h-14 rounded-full bg-[#f0f6ff] border border-blue-100 shrink-0 flex items-center justify-center text-2xl select-none group-hover:scale-105 transition-transform">
                  {c.icon || (c.adTitle?.includes('Layout') ? '🗺️' : c.adTitle?.includes('Scooter') ? '🛵' : '🏢')}
                </div>

                {/* Middle Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {c.otherPartyName || c.sellerName || 'Verified User'}
                    </h3>
                    <span className="text-[11px] font-light text-slate-400 shrink-0">
                      {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : c.timeAgo || 'Just now'}
                    </span>
                  </div>

                  <p className="text-blue-600 font-bold text-xs truncate">
                    Ad: {c.adTitle}
                  </p>

                  <p className="text-slate-500 text-xs font-light truncate">
                    {c.lastMessage}
                  </p>
                </div>

                {/* Unread Counter Badge */}
                {c.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                    {c.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
