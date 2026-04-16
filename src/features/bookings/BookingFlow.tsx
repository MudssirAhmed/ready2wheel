import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBooking } from '@/hooks/useBookings';
import { calculatePricing, formatCurrency, validatePincode } from '@/utils/helpers';
import type { Vehicle } from '@/types';

interface BookingFlowProps {
  vehicle: Vehicle;
  onClose: () => void;
}

type Step = 'dates' | 'location' | 'confirm' | 'success';

export const BookingFlow: React.FC<BookingFlowProps> = ({ vehicle, onClose }) => {
  const { user } = useAuth();
  const createBooking = useCreateBooking();

  const [step, setStep] = useState<Step>('dates');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getDateObj = (date: string, time: string) => new Date(`${date}T${time}`);

  const pricing = startDate && endDate
    ? calculatePricing(
        vehicle.pricing,
        getDateObj(startDate, startTime),
        getDateObj(endDate, endTime)
      )
    : null;

  const validateDates = () => {
    const e: Record<string, string> = {};
    if (!startDate) e.startDate = 'Pick-up date required';
    if (!endDate) e.endDate = 'Return date required';
    if (startDate && endDate) {
      const start = getDateObj(startDate, startTime);
      const end = getDateObj(endDate, endTime);
      if (end <= start) e.endDate = 'Return must be after pick-up';
      if (start < new Date()) e.startDate = 'Pick-up cannot be in the past';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateLocation = () => {
    const e: Record<string, string> = {};
    if (!validatePincode(pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!address.trim()) e.address = 'Address is required';
    if (!vehicle.serviceablePincodes.includes(pincode) && vehicle.serviceablePincodes.length > 0)
      e.pincode = 'This pincode is not serviceable for this vehicle';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!user || !pricing) return;
    try {
      await createBooking.mutateAsync({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleThumbnail: vehicle.thumbnailUrl,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        userPhone: user.phoneNumber ?? '',
        pickupPincode: pincode,
        pickupAddress: address,
        startDate: getDateObj(startDate, startTime),
        endDate: getDateObj(endDate, endTime),
        durationType: pricing.durationType,
        durationValue: pricing.durationValue,
        totalAmount: pricing.totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        notes,
      });
      setStep('success');
    } catch {
      setErrors({ submit: 'Booking failed. Please try again.' });
    }
  };

  const steps: Step[] = ['dates', 'location', 'confirm'];
  const stepIdx = steps.indexOf(step);

  return (
    <Modal isOpen onClose={onClose} title="Book Vehicle" maxWidth="max-w-lg">
      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i <= stepIdx ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded transition-all ${i < stepIdx ? 'bg-blue-600' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        {step === 'dates' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2"><Calendar size={18} /> Select Dates</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Pick-up Date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                error={errors.startDate}
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Pick-up Time"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
              <Input
                label="Return Date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                error={errors.endDate}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Return Time"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
            {pricing && (
              <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Duration</span>
                  <span className="text-white">{pricing.durationValue} {pricing.durationType}(s)</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Base ({formatCurrency(pricing.pricePerUnit)}/{pricing.durationType})</span>
                  <span className="text-white">{formatCurrency(pricing.baseAmount)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">GST (18%)</span>
                  <span className="text-white">{formatCurrency(pricing.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-white/10 pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-blue-400 text-lg">{formatCurrency(pricing.totalAmount)}</span>
                </div>
              </div>
            )}
            <Button
              fullWidth
              onClick={() => validateDates() && setStep('location')}
              disabled={!startDate || !endDate}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'location' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2"><MapPin size={18} /> Pick-up Location</h3>
            <Input
              label="Pincode"
              placeholder="6-digit pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              error={errors.pincode}
              maxLength={6}
            />
            <Input
              label="Full Address"
              placeholder="House/Building, Street, Landmark"
              value={address}
              onChange={e => setAddress(e.target.value)}
              error={errors.address}
            />
            <Input
              label="Notes (optional)"
              placeholder="Any special instructions..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('dates')} fullWidth>Back</Button>
              <Button onClick={() => validateLocation() && setStep('confirm')} fullWidth>Continue</Button>
            </div>
          </div>
        )}

        {step === 'confirm' && pricing && (
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2"><Clock size={18} /> Confirm Booking</h3>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/50">Vehicle</span><span className="text-white font-medium">{vehicle.name}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Pick-up</span><span className="text-white">{startDate} {startTime}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Return</span><span className="text-white">{endDate} {endTime}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Pincode</span><span className="text-white">{pincode}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                <span className="text-white">Total Amount</span>
                <span className="text-blue-400">{formatCurrency(pricing.totalAmount)}</span>
              </div>
            </div>
            {errors.submit && (
              <p className="text-sm text-red-400">{errors.submit}</p>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('location')} fullWidth>Back</Button>
              <Button onClick={handleConfirm} loading={createBooking.isPending} fullWidth>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={40} className="text-green-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-white/50 mb-6">
              Your booking request has been submitted. You'll receive a confirmation once it's approved.
            </p>
            <Button onClick={onClose} fullWidth>Done</Button>
          </div>
        )}
      </motion.div>
    </Modal>
  );
};
