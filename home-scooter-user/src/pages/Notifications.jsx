import React from 'react';
import { MOCK_NOTIFICATIONS } from '../mock/mockData';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Bell, CheckCircle2, Crown, PhoneCall } from 'lucide-react';

export const Notifications = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-xs text-slate-500 mt-0.5">Stay updated on your posted ads, callback leads & subscription statuses</p>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((item) => (
          <Card key={item.id} className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
