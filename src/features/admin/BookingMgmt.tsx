import React, { useState } from 'react';
import { useAllBookingsAdmin, useUpdateBookingStatus } from '@/hooks/useBookings';
import { Badge } from '@/components/UI';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/UI';
import { formatCurrency, formatDateTime, getStatusColor } from '@/utils/helpers';
import type { BookingStatus } from '@/types';

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected'],
  confirmed: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  rejected: [],
};

export const BookingMgmt: React.FC = () => {
  const { data: bookings = [], isLoading } = useAllBookingsAdmin();
  const updateStatus = useUpdateBookingStatus();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Bookings ({bookings.length})</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${
              filter === s
                ? 'bg-blue-600/60 border border-blue-400/40 text-white'
                : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
            }`}
          >
            {s} {s !== 'all' && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-left">
              <th className="pb-3 pr-4">Booking</th>
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Dates</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">
                  <p className="font-medium text-white">{b.vehicleName}</p>
                  <p className="text-xs text-white/40">#{b.id.slice(-8)}</p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-white">{b.userName}</p>
                  <p className="text-xs text-white/40">{b.userEmail}</p>
                </td>
                <td className="py-3 pr-4 text-xs text-white/60">
                  <div>{formatDateTime(b.startDate)}</div>
                  <div>{formatDateTime(b.endDate)}</div>
                </td>
                <td className="py-3 pr-4 font-medium text-white">{formatCurrency(b.totalAmount)}</td>
                <td className="py-3 pr-4">
                  <Badge label={b.status} color={getStatusColor(b.status)} />
                </td>
                <td className="py-3">
                  <div className="flex gap-1 flex-wrap">
                    {STATUS_TRANSITIONS[b.status].map(next => (
                      <Button
                        key={next}
                        size="sm"
                        variant={next === 'rejected' || next === 'cancelled' ? 'danger' : 'secondary'}
                        onClick={() => updateStatus.mutate({ id: b.id, status: next })}
                        loading={updateStatus.isPending}
                      >
                        {next}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-white/40 py-8 text-sm">No bookings found.</p>
        )}
      </div>
    </div>
  );
};
