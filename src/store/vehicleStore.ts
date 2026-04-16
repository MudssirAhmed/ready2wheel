import { create } from 'zustand';
import type { Vehicle, VehicleFilters } from '@/types';

interface VehicleState {
  filters: VehicleFilters;
  selectedVehicle: Vehicle | null;
  setFilters: (f: Partial<VehicleFilters>) => void;
  resetFilters: () => void;
  setSelectedVehicle: (v: Vehicle | null) => void;
}

const DEFAULT_FILTERS: VehicleFilters = {};

export const useVehicleStore = create<VehicleState>(set => ({
  filters: DEFAULT_FILTERS,
  selectedVehicle: null,
  setFilters: f => set(state => ({ filters: { ...state.filters, ...f } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setSelectedVehicle: v => set({ selectedVehicle: v }),
}));
