import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehiclesAdmin,
  getVehicleReviews,
  addReview,
  toggleWishlist,
} from '@/services/firestore';
import type { Vehicle, VehicleFilters, Review } from '@/types';

export const useVehicles = (filters: VehicleFilters = {}) => {
  return useInfiniteQuery<
    { vehicles: Vehicle[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null },
    Error,
    { pages: Array<{ vehicles: Vehicle[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> },
    (string | VehicleFilters)[],
    QueryDocumentSnapshot<DocumentData> | undefined
  >({
    queryKey: ['vehicles', filters],
    queryFn: ({ pageParam }) => getVehicles(filters, pageParam),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.lastDoc ?? undefined,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
    enabled: !!id,
  });
};

export const useAllVehiclesAdmin = () => {
  return useQuery({ queryKey: ['admin-vehicles'], queryFn: getAllVehiclesAdmin });
};

export const useVehicleReviews = (vehicleId: string) => {
  return useQuery({
    queryKey: ['reviews', vehicleId],
    queryFn: () => getVehicleReviews(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useCreateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => createVehicle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) => updateVehicle(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles'] });
      qc.invalidateQueries({ queryKey: ['admin-vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-vehicles'] }),
  });
};

export const useAddReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Review, 'id' | 'createdAt'>) => addReview(data),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ['reviews', v.vehicleId] });
      qc.invalidateQueries({ queryKey: ['vehicle', v.vehicleId] });
    },
  });
};

export const useToggleWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, vehicleId, add }: { userId: string; vehicleId: string; add: boolean }) =>
      toggleWishlist(userId, vehicleId, add),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user-profile'] }),
  });
};
