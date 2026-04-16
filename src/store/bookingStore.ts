import { create } from 'zustand';
import type { Booking } from '@/types';

interface BookingDraft {
  vehicleId: string;
  startDate: Date | null;
  endDate: Date | null;
  pickupPincode: string;
  pickupAddress: string;
  notes: string;
}

interface BookingState {
  draft: BookingDraft | null;
  selectedBooking: Booking | null;
  setDraft: (d: BookingDraft) => void;
  updateDraft: (d: Partial<BookingDraft>) => void;
  clearDraft: () => void;
  setSelectedBooking: (b: Booking | null) => void;
}

export const useBookingStore = create<BookingState>(set => ({
  draft: null,
  selectedBooking: null,
  setDraft: draft => set({ draft }),
  updateDraft: d => set(state => ({ draft: state.draft ? { ...state.draft, ...d } : null })),
  clearDraft: () => set({ draft: null }),
  setSelectedBooking: b => set({ selectedBooking: b }),
}));
