import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-base">
                H&S
              </div>
              <div>
                <span className="text-sm font-black text-white block">Home & Scooter</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">User Marketplace</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Discover verified plots, properties, EV scooters, and professional services across Bangalore and surrounding regions.
            </p>
            <div className="space-y-1.5 font-medium text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Hoskote, Bangalore, KA 562114
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> support@homescooter.com
              </p>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 font-semibold">
              <li><Link to="/categories/layout-sites" className="hover:text-white transition-colors">Layout Sites & Plots</Link></li>
              <li><Link to="/categories/properties" className="hover:text-white transition-colors">Houses & Apartments</Link></li>
              <li><Link to="/categories/electric-scooters" className="hover:text-white transition-colors">Electric Scooters (EV)</Link></li>
              <li><Link to="/categories/services" className="hover:text-white transition-colors">Professional Services</Link></li>
              <li><Link to="/categories/others" className="hover:text-white transition-colors">Miscellaneous Ads</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 font-semibold">
              <li><Link to="/near-me" className="hover:text-white transition-colors">Near Me Discovery</Link></li>
              <li><Link to="/new-ads" className="hover:text-white transition-colors">New Ads Feed</Link></li>
              <li><Link to="/top-viewed" className="hover:text-white transition-colors">Top Viewed Listings</Link></li>
              <li><Link to="/visitor-win" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Visitor Win Event</Link></li>
              <li><Link to="/subscription" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">₹100 Ad-Free Membership</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Support & Account</h4>
            <ul className="space-y-2.5 font-semibold">
              <li><Link to="/login" className="hover:text-white transition-colors">User Login</Link></li>
              <li><Link to="/post-ad" className="hover:text-white transition-colors">Post Your Advertisement</Link></li>
              <li><Link to="/my-ads" className="hover:text-white transition-colors">Manage My Posted Ads</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Saved Favorites</Link></li>
              <li><Link to="/chats" className="hover:text-white transition-colors">Buyer-Seller Chats</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 Home & Scooter Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Bangalore & Beyond
          </p>
        </div>
      </div>
    </footer>
  );
};
