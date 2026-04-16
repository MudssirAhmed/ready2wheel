import type { PricingTier, PricingResult, RentalDurationType } from '@/types';

export const calculatePricing = (
  pricing: PricingTier,
  startDate: Date,
  endDate: Date
): PricingResult => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  let durationType: RentalDurationType;
  let durationValue: number;
  let pricePerUnit: number;

  if (diffDays >= 30) {
    durationType = 'monthly';
    durationValue = Math.ceil(diffDays / 30);
    pricePerUnit = pricing.monthly;
  } else if (diffDays >= 7) {
    durationType = 'weekly';
    durationValue = Math.ceil(diffDays / 7);
    pricePerUnit = pricing.weekly;
  } else if (diffDays >= 1) {
    durationType = 'daily';
    durationValue = Math.ceil(diffDays);
    pricePerUnit = pricing.daily;
  } else {
    durationType = 'hourly';
    durationValue = Math.ceil(diffHours);
    pricePerUnit = pricing.hourly;
  }

  const baseAmount = pricePerUnit * durationValue;
  const taxAmount = baseAmount * 0.18; // 18% GST
  const totalAmount = baseAmount + taxAmount;

  return { baseAmount, taxAmount, totalAmount, durationType, durationValue, pricePerUnit };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/20',
    confirmed: 'text-blue-400 bg-blue-400/20',
    active: 'text-green-400 bg-green-400/20',
    completed: 'text-purple-400 bg-purple-400/20',
    cancelled: 'text-red-400 bg-red-400/20',
    rejected: 'text-red-400 bg-red-400/20',
  };
  return colors[status] ?? 'text-gray-400 bg-gray-400/20';
};

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : text.slice(0, max) + '…';

export const generateBookingId = (): string =>
  `BK${Date.now().toString(36).toUpperCase()}`;

export const validatePincode = (pin: string): boolean => /^\d{6}$/.test(pin);

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone);
