import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Vehicle, Booking, User, Review, VehicleFilters, ServiceablePincode } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toVehicle = (snap: QueryDocumentSnapshot<DocumentData>): Vehicle => {
  const d = snap.data();
  return {
    ...d,
    id: snap.id,
    createdAt: d.createdAt?.toDate() ?? new Date(),
    updatedAt: d.updatedAt?.toDate() ?? new Date(),
  } as Vehicle;
};

const toBooking = (snap: QueryDocumentSnapshot<DocumentData>): Booking => {
  const d = snap.data();
  return {
    ...d,
    id: snap.id,
    startDate: d.startDate?.toDate() ?? new Date(),
    endDate: d.endDate?.toDate() ?? new Date(),
    createdAt: d.createdAt?.toDate() ?? new Date(),
    updatedAt: d.updatedAt?.toDate() ?? new Date(),
  } as Booking;
};

// ─── Vehicles ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;

export const getVehicles = async (
  filters: VehicleFilters = {},
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ vehicles: Vehicle[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  let q = query(collection(db, 'vehicles'), where('isAvailable', '==', true));

  if (filters.type) q = query(q, where('type', '==', filters.type));
  if (filters.pincode)
    q = query(q, where('serviceablePincodes', 'array-contains', filters.pincode));
  if (filters.fuelType) q = query(q, where('fuelType', '==', filters.fuelType));
  if (filters.transmission) q = query(q, where('transmission', '==', filters.transmission));

  const sort = filters.sortBy ?? 'newest';
  if (sort === 'rating') q = query(q, orderBy('rating', 'desc'));
  else if (sort === 'price_asc') q = query(q, orderBy('pricing.daily', 'asc'));
  else if (sort === 'price_desc') q = query(q, orderBy('pricing.daily', 'desc'));
  else q = query(q, orderBy('createdAt', 'desc'));

  q = query(q, limit(PAGE_SIZE));
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snap = await getDocs(q);
  const vehicles = snap.docs.map(toVehicle);
  const newLastDoc = snap.docs.length === PAGE_SIZE ? snap.docs[snap.docs.length - 1] : null;
  return { vehicles, lastDoc: newLastDoc };
};

export const getAllVehiclesAdmin = async (): Promise<Vehicle[]> => {
  const snap = await getDocs(query(collection(db, 'vehicles'), orderBy('createdAt', 'desc')));
  return snap.docs.map(toVehicle);
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const snap = await getDoc(doc(db, 'vehicles', id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...d,
    id: snap.id,
    createdAt: d.createdAt?.toDate() ?? new Date(),
    updatedAt: d.updatedAt?.toDate() ?? new Date(),
  } as Vehicle;
};

export const createVehicle = async (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, 'vehicles'), {
    ...data,
    rating: 0,
    reviewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateVehicle = async (id: string, data: Partial<Vehicle>): Promise<void> => {
  await updateDoc(doc(db, 'vehicles', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'vehicles', id));
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(toBooking);
};

export const getAllBookingsAdmin = async (): Promise<Booking[]> => {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(toBooking);
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const snap = await getDoc(doc(db, 'bookings', id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...d,
    id: snap.id,
    startDate: d.startDate?.toDate() ?? new Date(),
    endDate: d.endDate?.toDate() ?? new Date(),
    createdAt: d.createdAt?.toDate() ?? new Date(),
    updatedAt: d.updatedAt?.toDate() ?? new Date(),
  } as Booking;
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<void> => {
  await updateDoc(doc(db, 'bookings', id), { status, updatedAt: serverTimestamp() });
};

export const getVehicleBookings = async (vehicleId: string): Promise<Booking[]> => {
  const q = query(
    collection(db, 'bookings'),
    where('vehicleId', '==', vehicleId),
    where('status', 'in', ['confirmed', 'active']),
    orderBy('startDate', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(toBooking);
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const getVehicleReviews = async (vehicleId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('vehicleId', '==', vehicleId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(s => {
    const d = s.data();
    return { ...d, id: s.id, createdAt: d.createdAt?.toDate() ?? new Date() } as Review;
  });
};

export const addReview = async (data: Omit<Review, 'id' | 'createdAt'>): Promise<void> => {
  const batch = writeBatch(db);
  const reviewRef = doc(collection(db, 'reviews'));
  batch.set(reviewRef, { ...data, createdAt: serverTimestamp() });

  const vehicleRef = doc(db, 'vehicles', data.vehicleId);
  const vehicleSnap = await getDoc(vehicleRef);
  if (vehicleSnap.exists()) {
    const { rating, reviewCount } = vehicleSnap.data() as Vehicle;
    const newCount = (reviewCount ?? 0) + 1;
    const newRating = ((rating ?? 0) * (reviewCount ?? 0) + data.rating) / newCount;
    batch.update(vehicleRef, { rating: newRating, reviewCount: newCount });
  }
  await batch.commit();
};

// ─── Users (admin) ────────────────────────────────────────────────────────────
export const getAllUsers = async (): Promise<User[]> => {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map(s => {
    const d = s.data();
    return {
      ...d,
      uid: s.id,
      createdAt: d.createdAt?.toDate() ?? new Date(),
      updatedAt: d.updatedAt?.toDate() ?? new Date(),
    } as User;
  });
};

export const updateUserRole = async (uid: string, role: User['role']): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), { role, updatedAt: serverTimestamp() });
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const toggleWishlist = async (userId: string, vehicleId: string, add: boolean): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    wishlist: add ? arrayUnion(vehicleId) : arrayRemove(vehicleId),
    updatedAt: serverTimestamp(),
  });
};

// ─── Pincodes ─────────────────────────────────────────────────────────────────
export const getServiceablePincodes = async (): Promise<ServiceablePincode[]> => {
  const snap = await getDocs(query(collection(db, 'serviceable_pincodes'), where('isActive', '==', true)));
  return snap.docs.map(s => ({ ...s.data(), id: s.id } as ServiceablePincode));
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const getAnalytics = async () => {
  const [usersSnap, vehiclesSnap, bookingsSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'vehicles')),
    getDocs(collection(db, 'bookings')),
  ]);

  const bookings = bookingsSnap.docs.map(toBooking);
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = bookings
    .filter(b => b.status === 'completed' && b.createdAt >= monthStart)
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const bookingsByStatus = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalUsers: usersSnap.size,
    totalVehicles: vehiclesSnap.size,
    totalBookings: bookingsSnap.size,
    activeBookings: bookingsByStatus['active'] ?? 0,
    totalRevenue,
    monthlyRevenue,
    bookingsByStatus,
    recentBookings: bookings.slice(0, 5),
  };
};
