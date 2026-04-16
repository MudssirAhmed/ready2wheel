// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  wishlist: string[];
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────
export type VehicleType = 'car' | 'bike' | 'scooter' | 'cycle' | 'truck' | 'van';
export type TransmissionType = 'manual' | 'automatic';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';

export interface PricingTier {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  description: string;
  features: string[];
  images: string[];
  thumbnailUrl: string;
  pricing: PricingTier;
  isAvailable: boolean;
  serviceablePincodes: string[];
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat?: number;
    lng?: number;
  };
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type RentalDurationType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleThumbnail: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  pickupPincode: string;
  pickupAddress: string;
  startDate: Date;
  endDate: Date;
  durationType: RentalDurationType;
  durationValue: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── ServiceablePincode ───────────────────────────────────────────────────────
export interface ServiceablePincode {
  id: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  isActive: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
  vehicleId: string;
  addedAt: Date;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface Analytics {
  totalUsers: number;
  totalVehicles: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  bookingsByStatus: Record<BookingStatus, number>;
  vehiclesByType: Record<VehicleType, number>;
  recentBookings: Booking[];
  topVehicles: Vehicle[];
}

// ─── Auth Forms ───────────────────────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// ─── Pricing Calculation ──────────────────────────────────────────────────────
export interface PricingResult {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  durationType: RentalDurationType;
  durationValue: number;
  pricePerUnit: number;
}

// ─── Vehicle Filters ──────────────────────────────────────────────────────────
export interface VehicleFilters {
  type?: VehicleType;
  pincode?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  seats?: number;
  isAvailable?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
