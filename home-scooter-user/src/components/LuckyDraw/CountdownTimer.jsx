import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, onExpire }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.expired) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Draw Closed / In Processing
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-center">
      <div className="bg-purple-950/80 text-white px-2.5 py-1.5 rounded-lg border border-purple-500/30">
        <span className="text-sm font-black block">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold">Days</span>
      </div>
      <span className="font-bold text-purple-400 text-xs">:</span>
      <div className="bg-purple-950/80 text-white px-2.5 py-1.5 rounded-lg border border-purple-500/30">
        <span className="text-sm font-black block">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold">Hours</span>
      </div>
      <span className="font-bold text-purple-400 text-xs">:</span>
      <div className="bg-purple-950/80 text-white px-2.5 py-1.5 rounded-lg border border-purple-500/30">
        <span className="text-sm font-black block">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold">Mins</span>
      </div>
      <span className="font-bold text-purple-400 text-xs">:</span>
      <div className="bg-purple-950/80 text-white px-2.5 py-1.5 rounded-lg border border-purple-500/30">
        <span className="text-sm font-black block">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold">Secs</span>
      </div>
    </div>
  );
};
