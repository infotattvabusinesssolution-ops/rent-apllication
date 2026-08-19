import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { MessageSquare, Send, Phone, User, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Chats = () => {
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState('chat-1');
  const [text, setText] = useState('');

  const { data: convsResult } = useQuery({
    queryKey: ['chatsList'],
    queryFn: chatApi.getConversations,
  });

  const { data: activeChat } = useQuery({
    queryKey: ['chatMessages', selectedChatId],
    queryFn: () => chatApi.getChatMessages(selectedChatId),
    enabled: !!selectedChatId,
  });

  const sendMutation = useMutation({
    mutationFn: ({ chatId, text }) => chatApi.sendMessage(chatId, text),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries(['chatMessages', selectedChatId]);
      queryClient.invalidateQueries(['chatsList']);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMutation.mutate({ chatId: selectedChatId, text: text.trim() });
  };

  const conversations = convsResult?.data || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketplace Chats</h1>
        <p className="text-xs text-slate-500 mt-0.5">Communicate directly with verified buyers and sellers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl border border-slate-200/80 shadow-md min-h-[550px] overflow-hidden">
        {/* Left: Conversations List */}
        <div className="border-r border-slate-100 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Messages</h3>
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedChatId(c.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedChatId === c.id
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{c.sellerName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{c.lastMessageTime}</span>
                </div>
                <p className="text-[11px] font-bold text-blue-600 truncate mt-0.5">{c.adTitle}</p>
                <p className="text-[11px] text-slate-500 truncate mt-1">{c.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-50/50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {activeChat.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{activeChat.sellerName}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{activeChat.adTitle}</p>
                  </div>
                </div>
                <a
                  href={`tel:${activeChat.sellerPhone}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-blue-600 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 px-2">
                {activeChat.messages.map((m) => {
                  const isMe = m.sender === 'buyer';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs font-medium ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold mt-1 px-1">{m.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message to seller..."
                  className="flex-1 p-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 shadow-xs"
                />
                <Button type="submit" icon={Send} isLoading={sendMutation.isPending} className="rounded-2xl px-5">
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a conversation to view chat history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
