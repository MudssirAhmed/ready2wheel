import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole, getAnalytics } from '@/services/firestore';
import type { User } from '@/types';

export const useAdminUsers = () => {
  return useQuery({ queryKey: ['admin-users'], queryFn: getAllUsers });
};

export const useAdminAnalytics = () => {
  return useQuery({ queryKey: ['admin-analytics'], queryFn: getAnalytics });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uid, role }: { uid: string; role: User['role'] }) => updateUserRole(uid, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};
