import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useVehicle } from '@/hooks/useVehicles';
import { VehicleCard } from '@/features/vehicles/VehicleCard';
import { useToggleWishlist } from '@/hooks/useVehicles';
import { Heart } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/UI';
import { Button } from '@/components/Button';

const WishlistVehicle: React.FC<{ vehicleId: string; userId: string }> = ({ vehicleId, userId }) => {
  const { data: vehicle, isLoading } = useVehicle(vehicleId);
  const wishlistMutation = useToggleWishlist();

  if (isLoading) return <div className="h-64 animate-pulse bg-white/5 rounded-2xl" />;
  if (!vehicle) return null;

  return (
    <VehicleCard
      vehicle={vehicle}
      isWishlisted
      onWishlist={() => wishlistMutation.mutate({ userId, vehicleId, add: false })}
    />
  );
};

export const Wishlist: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Wishlist</h1>
        <p className="text-white/50">Vehicles you've saved for later</p>
      </div>

      {user.wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart />}
          title="Your wishlist is empty"
          description="Browse vehicles and tap the heart icon to save them here."
          action={
            <Link to="/vehicles">
              <Button>Browse Vehicles</Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {user.wishlist.map(vId => (
            <motion.div
              key={vId}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <WishlistVehicle vehicleId={vId} userId={user.uid} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
