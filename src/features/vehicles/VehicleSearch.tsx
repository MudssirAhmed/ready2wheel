import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useVehicleStore } from '@/store/vehicleStore';
import type { VehicleType, FuelType, TransmissionType } from '@/types';

const vehicleTypes: VehicleType[] = ['car', 'bike', 'scooter', 'cycle', 'truck', 'van'];
const fuelTypes: FuelType[] = ['petrol', 'diesel', 'electric', 'hybrid', 'cng'];

export const VehicleSearch: React.FC = () => {
  const { filters, setFilters, resetFilters } = useVehicleStore();
  const [pincode, setPincode] = useState(filters.pincode ?? '');
  const [showFilters, setShowFilters] = useState(false);

  const applyPincode = () => {
    if (pincode.length === 6) setFilters({ pincode });
    else if (pincode === '') setFilters({ pincode: undefined });
  };

  const activeFilterCount = [filters.type, filters.fuelType, filters.transmission, filters.pincode].filter(Boolean).length;

  return (
    <div className="mb-6">
      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Enter 6-digit pincode to find vehicles near you"
            value={pincode}
            onChange={e => setPincode(e.target.value)}
            icon={<Search size={16} />}
            onKeyDown={e => e.key === 'Enter' && applyPincode()}
          />
        </div>
        <Button onClick={applyPincode} size="md">
          Search
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowFilters(o => !o)}
          icon={<SlidersHorizontal size={16} />}
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap gap-6"
        >
          {/* Vehicle Type */}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Vehicle Type</p>
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setFilters({ type: filters.type === t ? undefined : t })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    filters.type === t
                      ? 'bg-blue-600/60 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Fuel Type</p>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map(f => (
                <button
                  key={f}
                  onClick={() => setFilters({ fuelType: filters.fuelType === f ? undefined : f })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    filters.fuelType === f
                      ? 'bg-blue-600/60 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Transmission</p>
            <div className="flex gap-2">
              {(['manual', 'automatic'] as TransmissionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setFilters({ transmission: filters.transmission === t ? undefined : t })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    filters.transmission === t
                      ? 'bg-blue-600/60 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Sort By</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'rating', label: 'Top Rated' },
                { value: 'price_asc', label: 'Price: Low' },
                { value: 'price_desc', label: 'Price: High' },
              ].map(s => (
                <button
                  key={s.value}
                  onClick={() => setFilters({ sortBy: s.value as any })}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    (filters.sortBy ?? 'newest') === s.value
                      ? 'bg-blue-600/60 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { resetFilters(); setPincode(''); }}
                icon={<X size={14} />}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
