import React, { useMemo } from 'react';
import { useVehicleBookings } from '@/hooks/useBookings';

interface AvailabilityCalendarProps {
  vehicleId: string;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ vehicleId }) => {
  const { data: bookings = [] } = useVehicleBookings(vehicleId);

  const bookedRanges = useMemo(() =>
    bookings.map(b => ({ start: b.startDate, end: b.endDate })),
    [bookings]
  );

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const isBooked = (day: number) => {
    const date = new Date(year, month, day);
    return bookedRanges.some(r => date >= r.start && date <= r.end);
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-white/80 mb-3">
        Availability — {monthNames[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-xs text-white/30 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const booked = isBooked(day);
          const isPast = new Date(year, month, day) < today;
          return (
            <div
              key={day}
              className={`text-xs py-1.5 rounded-lg text-center font-medium transition-all ${
                booked
                  ? 'bg-red-500/30 text-red-300 border border-red-500/30'
                  : isPast
                  ? 'text-white/20'
                  : 'bg-green-500/20 text-green-300 border border-green-500/20'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/20" />
          <span className="text-white/40">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/30" />
          <span className="text-white/40">Booked</span>
        </div>
      </div>
    </div>
  );
};
