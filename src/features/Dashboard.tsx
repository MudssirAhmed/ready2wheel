import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { BookingHistory } from '@/features/bookings/BookingHistory';
import { Car, Calendar, Heart } from 'lucide-react';
import { Card } from '@/components/Card';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-white/50 mt-1">Manage your bookings and account</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><Car size={20} /></div>
            <div>
              <p className="text-xs text-white/50">Total Bookings</p>
              <p className="text-xl font-bold text-white">—</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20 text-green-400"><Calendar size={20} /></div>
            <div>
              <p className="text-xs text-white/50">Active Rentals</p>
              <p className="text-xl font-bold text-white">—</p>
            </div>
          </Card>
          <Link to="/wishlist">
            <Card hover className="flex items-center gap-4 cursor-pointer">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-400"><Heart size={20} /></div>
              <div>
                <p className="text-xs text-white/50">Wishlist</p>
                <p className="text-xl font-bold text-white">{user?.wishlist.length ?? 0}</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Booking History */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Your Bookings</h2>
          <BookingHistory />
        </div>
      </motion.div>
    </div>
  );
};
