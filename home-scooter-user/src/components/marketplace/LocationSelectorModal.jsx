import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { LOCATIONS } from '../../constants/categories';
import { MapPin, Check, Search, Navigation, Loader2, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGooglePlaces } from '../../hooks/useGooglePlaces';
import { toast } from 'sonner';

export const LocationSelectorModal = ({ isOpen, onClose }) => {
  const { selectedLocation, updateLocation } = useAuth();
  const { isLoaded, getPredictions, getCurrentAddress } = useGooglePlaces();

  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Handle Google Maps real-time place predictions search
  useEffect(() => {
    let active = true;
    if (!searchQuery || searchQuery.trim().length < 2) {
      setPredictions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await getPredictions(searchQuery);
        if (active) {
          setPredictions(results || []);
        }
      } catch (err) {
        if (active) setPredictions([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle Detect Current GPS Location using Google Geocoding API
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const res = await getCurrentAddress();
      const address = typeof res === 'string' ? res : res.address;
      const coords = typeof res === 'object' ? res.coords : {};

      updateLocation(address, coords);
      onClose();
    } catch (err) {
      toast.error('Unable to detect location. Please select manually or check browser location permissions.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectLocation = (locName) => {
    updateLocation(locName);
    setSearchQuery('');
    setPredictions([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Location"
      subtitle="Choose your city or region to explore nearby marketplace listings"
    >
      <div className="space-y-4">
        {/* Search Bar with Real-Time Google Places */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, area, or locality (Google Maps)..."
            className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl pl-10 pr-10 py-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setPredictions([]);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : isSearching ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          ) : null}
        </div>

        {/* GPS Current Location Detector Button */}
        <button
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] disabled:opacity-75 cursor-pointer"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Detecting Live Location with Google Maps...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 fill-white" />
              <span className="text-xs">Use Current GPS Location</span>
            </>
          )}
        </button>

        {/* Real-time Search Predictions List (Google Places API) */}
        {searchQuery.trim().length >= 2 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Google Maps Results</span>
              {isSearching && <span className="text-blue-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Searching...</span>}
            </div>

            {predictions.length > 0 ? (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {predictions.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectLocation(place)}
                    className="p-3 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 cursor-pointer transition-all bg-white"
                  >
                    <div className="p-2 bg-blue-100/60 text-blue-600 rounded-lg shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{place}</span>
                  </div>
                ))}
              </div>
            ) : !isSearching ? (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-xs text-slate-500 font-medium">
                No matching locations found for "{searchQuery}"
              </div>
            ) : null}
          </div>
        )}

        {/* Popular Locations List */}
        {!searchQuery && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Popular Cities & Regions
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {LOCATIONS.map((loc) => {
                const isSelected = selectedLocation === loc;
                return (
                  <div
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{loc}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Google Maps Integration Footer Badge */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" /> Powered by Google Maps API
          </span>
          <span className="text-slate-400 font-mono">Real-Time Geocoding Active</span>
        </div>
      </div>
    </Modal>
  );
};
