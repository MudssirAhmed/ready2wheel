import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Package } from 'lucide-react';
import { useUserBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/Card';
import { Badge } from '@/components/UI';
import { LoadingSpinner, EmptyState } from '@/components/UI';
import { formatCurrency, formatDateTime, getStatusColor } from '@/utils/helpers';

export const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useUserBookings(user?.uid ?? '');

  if (isLoading) return <LoadingSpinner size="lg" text="Loading bookings..." />;

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<Package />}
        title="No bookings yet"
        description="Start exploring vehicles and make your first booking!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking, i) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card>
            <div className="flex items-start gap-4">
              <img
                src={booking.vehicleThumbnail || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100'}
                alt={booking.vehicleName}
                className="w-20 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-white text-sm">{booking.vehicleName}</h4>
                  <Badge
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                  <Calendar size={12} />
                  <span>{formatDateTime(booking.startDate)}</span>
                  <span>→</span>
                  <span>{formatDateTime(booking.endDate)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/40">
                    {booking.durationValue} {booking.durationValue === 1 ? booking.durationType : ({ hourly: 'hours', daily: 'days', weekly: 'weeks', monthly: 'months' }[booking.durationType] ?? booking.durationType + 's')} · {booking.pickupPincode}
                  </span>
                  <span className="font-bold text-blue-400 text-sm">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
