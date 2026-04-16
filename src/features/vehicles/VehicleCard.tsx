import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Fuel, Users, Zap, Heart } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/UI';
import { formatCurrency } from '@/utils/helpers';
import type { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlist?: (id: string, add: boolean) => void;
  isWishlisted?: boolean;
}

const fuelIcons: Record<string, React.ReactNode> = {
  electric: <Zap size={12} className="text-yellow-400" />,
  petrol: <Fuel size={12} className="text-orange-400" />,
  diesel: <Fuel size={12} className="text-blue-400" />,
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onWishlist, isWishlisted }) => (
  <Card hover padding="none" className="overflow-hidden group">
    <div className="relative">
      <img
        src={vehicle.thumbnailUrl || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'}
        alt={vehicle.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {onWishlist && (
        <button
          onClick={e => { e.preventDefault(); onWishlist(vehicle.id, !isWishlisted); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'text-red-400 fill-red-400' : 'text-white/70'}
          />
        </button>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-1">
        <Badge
          label={vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
          color="bg-black/40 text-white/80 border-white/20"
        />
        {!vehicle.isAvailable && (
          <Badge label="Unavailable" color="bg-red-500/40 text-red-200 border-red-400/30" />
        )}
      </div>
    </div>

    <Link to={`/vehicles/${vehicle.id}`} className="block p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight">{vehicle.name}</h3>
          <p className="text-xs text-white/50">{vehicle.brand} {vehicle.model} · {vehicle.year}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 shrink-0 ml-2">
          <Star size={12} className="fill-yellow-400" />
          <span className="text-xs text-white/70">{vehicle.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 text-xs text-white/50">
        <span className="flex items-center gap-1">
          {fuelIcons[vehicle.fuelType] ?? <Fuel size={12} />}
          {vehicle.fuelType}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {vehicle.seats}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {vehicle.location.city}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-bold text-white">{formatCurrency(vehicle.pricing.daily)}</span>
          <span className="text-xs text-white/40"> /day</span>
        </div>
        <span className="text-xs text-white/40">{formatCurrency(vehicle.pricing.hourly)}/hr</span>
      </div>
    </Link>
  </Card>
);
