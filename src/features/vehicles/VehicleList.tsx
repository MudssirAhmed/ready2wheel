import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleStore } from '@/store/vehicleStore';
import { useAuthStore } from '@/store/authStore';
import { useToggleWishlist } from '@/hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { VehicleSearch } from './VehicleSearch';
import { Button } from '@/components/Button';
import { LoadingSpinner, EmptyState } from '@/components/UI';

export const VehicleList: React.FC = () => {
  const { filters } = useVehicleStore();
  const { user } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useVehicles(filters);
  const wishlistMutation = useToggleWishlist();

  const vehicles = data?.pages.flatMap(p => p.vehicles) ?? [];

  const handleWishlist = (vehicleId: string, add: boolean) => {
    if (!user) return;
    wishlistMutation.mutate({ userId: user.uid, vehicleId, add });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Vehicles</h1>
        <p className="text-white/50">Find the perfect vehicle for your journey</p>
      </div>

      <VehicleSearch />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Loading vehicles..." />
        </div>
      ) : isError ? (
        <EmptyState
          icon={<Car />}
          title="Failed to load vehicles"
          description="Something went wrong. Please try again."
        />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={<Car />}
          title="No vehicles found"
          description="Try adjusting your filters or search in a different area."
        />
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {vehicles.map(v => (
              <motion.div
                key={v.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <VehicleCard
                  vehicle={v}
                  isWishlisted={user?.wishlist.includes(v.id)}
                  onWishlist={user ? handleWishlist : undefined}
                />
              </motion.div>
            ))}
          </motion.div>

          {hasNextPage && (
            <div className="text-center mt-10">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
