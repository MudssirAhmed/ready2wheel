import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// ─── Booking Created Trigger ──────────────────────────────────────────────────
export const onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const { bookingId } = context.params;

    // Validate the booking
    if (!booking.vehicleId || !booking.userId || booking.totalAmount <= 0) {
      await snap.ref.update({ status: 'rejected', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return;
    }

    // Check vehicle availability
    const vehicleSnap = await db.doc(`vehicles/${booking.vehicleId}`).get();
    if (!vehicleSnap.exists || !vehicleSnap.data()?.isAvailable) {
      await snap.ref.update({ status: 'rejected', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return;
    }

    functions.logger.info(`New booking created: ${bookingId}`, { bookingId, userId: booking.userId });
  });

// ─── Calculate Pricing ────────────────────────────────────────────────────────
export const calculateBookingPrice = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const { vehicleId, startDate, endDate } = data;
  if (!vehicleId || !startDate || !endDate) {
    throw new functions.https.HttpsError('invalid-argument', 'vehicleId, startDate, endDate are required.');
  }

  const vehicleSnap = await db.doc(`vehicles/${vehicleId}`).get();
  if (!vehicleSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Vehicle not found.');
  }

  const vehicle = vehicleSnap.data()!;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  let durationType: string;
  let durationValue: number;
  let pricePerUnit: number;

  if (diffDays >= 30) {
    durationType = 'monthly';
    durationValue = Math.ceil(diffDays / 30);
    pricePerUnit = vehicle.pricing.monthly;
  } else if (diffDays >= 7) {
    durationType = 'weekly';
    durationValue = Math.ceil(diffDays / 7);
    pricePerUnit = vehicle.pricing.weekly;
  } else if (diffDays >= 1) {
    durationType = 'daily';
    durationValue = Math.ceil(diffDays);
    pricePerUnit = vehicle.pricing.daily;
  } else {
    durationType = 'hourly';
    durationValue = Math.ceil(diffHours);
    pricePerUnit = vehicle.pricing.hourly;
  }

  const baseAmount = pricePerUnit * durationValue;
  const taxAmount = baseAmount * 0.18;
  const totalAmount = baseAmount + taxAmount;

  return { baseAmount, taxAmount, totalAmount, durationType, durationValue, pricePerUnit };
});

// ─── Send Booking Confirmation ────────────────────────────────────────────────
export const onBookingStatusChange = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return;

    const { bookingId } = context.params;
    functions.logger.info(`Booking ${bookingId} status changed: ${before.status} → ${after.status}`);

    // Here you could send email notifications via SendGrid/Mailgun
    // For now, we just log the change
    return null;
  });

// ─── User Registration Trigger ───────────────────────────────────────────────
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user registered: ${user.uid}`, { email: user.email });
  // Additional user setup can go here
});
