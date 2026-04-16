import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Car, CalendarDays, Users, TrendingUp, Package,
  Plus, List, UserCog, Home
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdmin';
import { Card } from '@/components/Card';
import { LoadingSpinner } from '@/components/UI';
import { formatCurrency } from '@/utils/helpers';
import { VehicleCRUD } from './VehicleCRUD';
import { BookingMgmt } from './BookingMgmt';
import { UserMgmt } from './UserMgmt';

type AdminTab = 'overview' | 'vehicles' | 'bookings' | 'users';

const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
  { id: 'vehicles', label: 'Vehicles', icon: <Car size={16} /> },
  { id: 'bookings', label: 'Bookings', icon: <CalendarDays size={16} /> },
  { id: 'users', label: 'Users', icon: <Users size={16} /> },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { data: analytics, isLoading } = useAdminAnalytics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Manage your vehicle rental platform</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-blue-600/60 border border-blue-400/40 text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        isLoading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : (
          <OverviewTab analytics={analytics} />
        )
      )}
      {activeTab === 'vehicles' && <VehicleCRUD />}
      {activeTab === 'bookings' && <BookingMgmt />}
      {activeTab === 'users' && <UserMgmt />}
    </div>
  );
};

const OverviewTab: React.FC<{ analytics: any }> = ({ analytics }) => {
  if (!analytics) return null;

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: <Users size={20} />, color: 'text-blue-400' },
    { label: 'Total Vehicles', value: analytics.totalVehicles, icon: <Car size={20} />, color: 'text-cyan-400' },
    { label: 'Total Bookings', value: analytics.totalBookings, icon: <Package size={20} />, color: 'text-purple-400' },
    { label: 'Active Bookings', value: analytics.activeBookings, icon: <TrendingUp size={20} />, color: 'text-green-400' },
    { label: 'Total Revenue', value: formatCurrency(analytics.totalRevenue), icon: <BarChart2 size={20} />, color: 'text-yellow-400' },
    { label: 'Monthly Revenue', value: formatCurrency(analytics.monthlyRevenue), icon: <TrendingUp size={20} />, color: 'text-orange-400' },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
    >
      {stats.map((s, i) => (
        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Card>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-sm text-white/50">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
