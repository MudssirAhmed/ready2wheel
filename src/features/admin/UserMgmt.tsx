import React from 'react';
import { useAdminUsers, useUpdateUserRole } from '@/hooks/useAdmin';
import { Badge } from '@/components/UI';
import { LoadingSpinner } from '@/components/UI';
import { formatDate } from '@/utils/helpers';
import type { User } from '@/types';

export const UserMgmt: React.FC = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Users ({users.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-left">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">Joined</th>
              <th className="pb-3 pr-4">Verified</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.displayName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{u.displayName}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-white/60">{u.phoneNumber ?? '—'}</td>
                <td className="py-3 pr-4 text-white/60">{formatDate(u.createdAt)}</td>
                <td className="py-3 pr-4">
                  <Badge
                    label={u.emailVerified ? 'Verified' : 'Unverified'}
                    color={u.emailVerified ? 'bg-green-500/20 text-green-300 border-green-500/20' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'}
                  />
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    label={u.role}
                    color={u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-white/10 text-white/60 border-white/10'}
                  />
                </td>
                <td className="py-3">
                  <button
                    onClick={() => updateRole.mutate({ uid: u.uid, role: u.role === 'admin' ? 'user' : 'admin' })}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    disabled={updateRole.isPending}
                  >
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
