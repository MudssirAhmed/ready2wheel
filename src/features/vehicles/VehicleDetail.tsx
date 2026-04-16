import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Users, Fuel, Settings, Calendar, Heart, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useVehicle, useVehicleReviews, useAddReview, useToggleWishlist } from '@/hooks/useVehicles';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingSpinner, StarRating, EmptyState } from '@/components/UI';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { BookingFlow } from '../bookings/BookingFlow';

export const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: vehicle, isLoading } = useVehicle(id!);
  const { data: reviews = [] } = useVehicleReviews(id!);
  const addReview = useAddReview();
  const wishlistMutation = useToggleWishlist();

  const [imgIdx, setImgIdx] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading vehicle..." />
    </div>
  );

  if (!vehicle) return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <EmptyState title="Vehicle not found" description="This vehicle may have been removed." />
    </div>
  );

  const images = vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
  ];
  const isWishlisted = user?.wishlist.includes(vehicle.id);

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return; }
    wishlistMutation.mutate({ userId: user.uid, vehicleId: vehicle.id, add: !isWishlisted });
  };

  const handleSubmitReview = async () => {
    if (!user) return;
    await addReview.mutateAsync({
      vehicleId: vehicle.id,
      userId: user.uid,
      userName: user.displayName,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewComment('');
    setReviewRating(5);
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image gallery */}
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <motion.img
              key={imgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[imgIdx]}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-blue-400' : 'border-white/10'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{vehicle.name}</h1>
                <p className="text-white/50">{vehicle.brand} {vehicle.model} · {vehicle.year}</p>
              </div>
              <button
                onClick={handleWishlist}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                <Heart size={20} className={isWishlisted ? 'text-red-400 fill-red-400' : 'text-white/50'} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={16} className="fill-yellow-400" />
                <span className="text-white font-medium">{vehicle.rating.toFixed(1)}</span>
                <span className="text-white/40 text-sm">({vehicle.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-white/50 text-sm">
                <MapPin size={14} /> {vehicle.location.city}, {vehicle.location.state}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { icon: <Fuel size={18} />, label: 'Fuel', value: vehicle.fuelType },
                { icon: <Settings size={18} />, label: 'Transmission', value: vehicle.transmission },
                { icon: <Users size={18} />, label: 'Seats', value: `${vehicle.seats} seats` },
                { icon: <Calendar size={18} />, label: 'Year', value: vehicle.year.toString() },
              ].map(item => (
                <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-blue-400 flex justify-center mb-1">{item.icon}</div>
                  <p className="text-xs text-white/40">{item.label}</p>
                  <p className="text-sm font-medium text-white capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-5">{vehicle.description}</p>

            {vehicle.features.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-white/80 mb-3">Features</p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map(f => (
                    <span
                      key={f}
                      className="text-xs bg-blue-600/20 border border-blue-400/20 text-blue-300 px-3 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Reviews</h3>
              {isAuthenticated && (
                <Button size="sm" variant="secondary" onClick={() => setShowReviewForm(s => !s)}>
                  Write Review
                </Button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-5 p-4 bg-white/5 rounded-xl">
                <div className="mb-3">
                  <p className="text-sm text-white/60 mb-2">Your Rating</p>
                  <StarRating
                    rating={reviewRating}
                    size={24}
                    interactive
                    onChange={setReviewRating}
                  />
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-blue-400/50 resize-none mb-3"
                />
                <Button size="sm" loading={addReview.isPending} onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-white/40">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="pb-4 border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{r.userName}</span>
                      <StarRating rating={r.rating} size={13} />
                    </div>
                    <p className="text-sm text-white/50">{r.comment}</p>
                    <p className="text-xs text-white/30 mt-1">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Pricing + Booking */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Pricing</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Per Hour', price: vehicle.pricing.hourly },
                { label: 'Per Day', price: vehicle.pricing.daily },
                { label: 'Per Week', price: vehicle.pricing.weekly },
                { label: 'Per Month', price: vehicle.pricing.monthly },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/60">{p.label}</span>
                  <span className="font-semibold text-white">{formatCurrency(p.price)}</span>
                </div>
              ))}
            </div>

            {vehicle.isAvailable ? (
              <Button
                fullWidth
                size="lg"
                onClick={() => isAuthenticated ? setShowBooking(true) : navigate('/login')}
              >
                Book Now
              </Button>
            ) : (
              <Button fullWidth size="lg" disabled>
                Currently Unavailable
              </Button>
            )}

            <p className="text-xs text-white/30 text-center mt-3">+18% GST will be added at checkout</p>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingFlow vehicle={vehicle} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
};
