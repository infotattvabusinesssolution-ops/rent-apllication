import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Map, Building2, Bike, Wrench, Package, PlusCircle } from 'lucide-react';

export const Sell = () => {
  const navigate = useNavigate();

  const options = [
    { title: CATEGORIES.LAYOUT_SITES, desc: 'Post residential plots, land layouts & DC converted land', icon: Map, color: 'text-blue-600 bg-blue-50' },
    { title: CATEGORIES.PROPERTIES, desc: 'Post houses, rental flats, shops, offices & guest houses', icon: Building2, color: 'text-teal-600 bg-teal-50' },
    { title: CATEGORIES.ELECTRIC_SCOOTERS, desc: 'Post EV scooters for sale, daily & monthly rentals', icon: Bike, color: 'text-emerald-600 bg-emerald-50' },
    { title: CATEGORIES.SERVICES, desc: 'Post interior design, solar setup, repairs & services', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
    { title: CATEGORIES.OTHERS, desc: 'Post miscellaneous items & promotional offers', icon: Package, color: 'text-slate-600 bg-slate-100' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">What do you want to sell or rent?</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Choose a category below to start creating your marketplace advertisement
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <Card
              key={opt.title}
              hover
              onClick={() => navigate('/post-ad')}
              className="p-6 flex items-start gap-4 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${opt.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Button size="lg" icon={PlusCircle} onClick={() => navigate('/post-ad')} className="font-bold">
          Start Posting Ad
        </Button>
      </div>
    </div>
  );
};
