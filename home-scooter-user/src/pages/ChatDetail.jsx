import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ChatDetail = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const currentUserId = user?.id || user?.userId || 'USR-8821';
  const currentUserName = user?.name || 'Buyer';

  // Fetch messages from MongoDB
  const { data: chatData, isLoading } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: () => chatApi.getChatMessages(chatId),
    refetchInterval: 2500, // Real-time polling backup
    enabled: !!chatId,
  });

  const chatInfo = chatData?.chat;
  const messagesList = chatData?.messages || [];

  // Connect Real-time Socket Event Stream
  useEffect(() => {
    let eventSource = null;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5027';
      eventSource = new EventSource(`${apiBase.replace(/\/+$/, '')}/api/v1/user/chats/events`);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'chat:new-message' && parsed.data?.chatId === chatId) {
            queryClient.invalidateQueries(['chatMessages', chatId]);
          }
        } catch (e) {}
      };
    } catch (err) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [chatId, queryClient]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesList]);

  // Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: (msgText) =>
      chatApi.sendMessage(chatId, {
        text: msgText,
        senderId: currentUserId,
        senderName: currentUserName,
      }),
    onSuccess: (res) => {
      if (res?.success) {
        setText('');
        queryClient.invalidateQueries(['chatMessages', chatId]);
        queryClient.invalidateQueries(['userChats']);
      } else {
        toast.error(res?.message || 'Failed to send message');
      }
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || sendMutation.isPending) return;
    sendMutation.mutate(text.trim());
  };

  // Initial conversation fallback if loading fresh
  const fallbackMessages = messagesList.length > 0 ? messagesList : [
    {
      id: 'MSG-1',
      senderId: currentUserId,
      text: 'Hello! I saw your layout site listing in Hoskote.',
      createdAt: '10:40 AM',
    },
    {
      id: 'MSG-2',
      senderId: currentUserId,
      text: 'Is the Hoskote layout site still available for visit?',
      createdAt: '10:42 AM',
    },
  ];

  const otherPartyName = chatInfo ? (chatInfo.buyerId === currentUserId ? chatInfo.sellerName : chatInfo.buyerName) : 'Hoskote Realties';
  const adTitle = chatInfo?.adTitle || 'Premium Layout Site';

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-lg mx-auto bg-white font-serif relative">
      {/* Header Bar */}
      <div className="flex items-center gap-3 py-3 px-2 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button
          onClick={() => navigate('/chats')}
          className="p-2 -ml-2 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Back to chats"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {otherPartyName}
          </h1>
          <p className="text-xs font-bold text-blue-600 tracking-wide">
            Re: {adTitle}
          </p>
        </div>
      </div>

      {/* Message History Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          fallbackMessages.map((m) => {
            const isMe = m.senderId === currentUserId || m.sender === 'me' || true;
            const timeStr = typeof m.createdAt === 'string'
              ? m.createdAt
              : new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={m.id || m.messageId}
                className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md p-4 rounded-3xl text-sm font-light leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#f0f4f8] text-slate-800 border border-slate-200/60'
                      : 'bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] font-light text-slate-400 px-2">
                  {timeStr}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Message Input Bar */}
      <div className="p-3 border-t border-slate-100 bg-white sticky bottom-0 z-10">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#f8fafc] border border-slate-200/80 rounded-full px-5 py-3.5 text-sm font-light text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!text.trim() || sendMutation.isPending}
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            aria-label="Send message"
          >
            {sendMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 fill-white transform translate-x-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
