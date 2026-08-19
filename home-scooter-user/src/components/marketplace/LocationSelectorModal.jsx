import React from 'react';
import { Modal } from '../common/Modal';
import { LOCATIONS } from '../../constants/categories';
import { MapPin, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LocationSelectorModal = ({ isOpen, onClose }) => {
  const { selectedLocation, updateLocation } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Location" subtitle="Choose your city or region to explore nearby marketplace listings">
      <div className="space-y-2">
        {LOCATIONS.map((loc) => {
          const isSelected = selectedLocation === loc;
          return (
            <div
              key={loc}
              onClick={() => {
                updateLocation(loc);
                onClose();
              }}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-sm">{loc}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
