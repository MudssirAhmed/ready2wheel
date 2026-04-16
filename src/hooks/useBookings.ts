import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  getUserBookings,
  getAllBookingsAdmin,
  updateBookingStatus,
  getVehicleBookings,
} from '@/services/firestore';
import type { Booking } from '@/types';

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId,
  });
};

export const useAllBookingsAdmin = () => {
  return useQuery({ queryKey: ['admin-bookings'], queryFn: getAllBookingsAdmin });
};

export const useVehicleBookings = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicle-bookings', vehicleId],
    queryFn: () => getVehicleBookings(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => createBooking(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
