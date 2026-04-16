import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { useAllVehiclesAdmin, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '@/hooks/useVehicles';
import { useAuthStore } from '@/store/authStore';
import { uploadVehicleImage } from '@/services/storage';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { LoadingSpinner, Badge } from '@/components/UI';
import { formatCurrency, getStatusColor } from '@/utils/helpers';
import type { Vehicle, VehicleType, FuelType, TransmissionType } from '@/types';

const emptyVehicle = {
  name: '', brand: '', model: '', year: new Date().getFullYear(),
  type: 'car' as VehicleType, transmission: 'manual' as TransmissionType,
  fuelType: 'petrol' as FuelType, seats: 5, description: '', features: [] as string[],
  images: [] as string[], thumbnailUrl: '', isAvailable: true,
  serviceablePincodes: [] as string[],
  pricing: { hourly: 0, daily: 0, weekly: 0, monthly: 0 },
  location: { address: '', city: '', state: '', pincode: '' },
  ownerId: '', rating: 0, reviewCount: 0,
};

export const VehicleCRUD: React.FC = () => {
  const { data: vehicles = [], isLoading } = useAllVehiclesAdmin();
  const { user } = useAuthStore();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<typeof emptyVehicle>({ ...emptyVehicle });
  const [uploading, setUploading] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const openCreate = () => { setEditing(null); setForm({ ...emptyVehicle }); setShowModal(true); };
  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      ...emptyVehicle, ...v,
      pricing: v.pricing,
      location: v.location,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const tempId = editing?.id ?? `new_${Date.now()}`;
      const url = await uploadVehicleImage(file, tempId);
      setForm(f => ({
        ...f,
        images: [...f.images, url],
        thumbnailUrl: f.thumbnailUrl || url,
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const data = { ...form, ownerId: user?.uid ?? '' };
    if (editing) {
      await updateVehicle.mutateAsync({ id: editing.id, data });
    } else {
      await createVehicle.mutateAsync(data as any);
    }
    setShowModal(false);
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Vehicles ({vehicles.length})</h2>
        <Button size="sm" icon={<Plus size={16} />} onClick={openCreate}>Add Vehicle</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-left">
              <th className="pb-3 pr-4">Vehicle</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Daily Price</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=60'}
                      alt={v.name}
                      className="w-12 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{v.name}</p>
                      <p className="text-xs text-white/40">{v.brand} · {v.year}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 capitalize text-white/60">{v.type}</td>
                <td className="py-3 pr-4 text-white">{formatCurrency(v.pricing.daily)}</td>
                <td className="py-3 pr-4">
                  <Badge
                    label={v.isAvailable ? 'Available' : 'Unavailable'}
                    color={v.isAvailable ? 'bg-green-500/20 text-green-300 border-green-500/20' : 'bg-red-500/20 text-red-300 border-red-500/20'}
                  />
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteVehicle.mutate(v.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Vehicle' : 'Add Vehicle'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Vehicle Name" value={form.name} onChange={f('name')} placeholder="e.g. Swift Dzire" />
            <Input label="Brand" value={form.brand} onChange={f('brand')} placeholder="Maruti Suzuki" />
            <Input label="Model" value={form.model} onChange={f('model')} placeholder="Dzire" />
            <Input label="Year" type="number" value={form.year.toString()} onChange={f('year')} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">Type</label>
              <select value={form.type} onChange={f('type')} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-400/50">
                {['car','bike','scooter','cycle','truck','van'].map(t => (
                  <option key={t} value={t} className="bg-slate-800">{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">Transmission</label>
              <select value={form.transmission} onChange={f('transmission')} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-400/50">
                <option value="manual" className="bg-slate-800">Manual</option>
                <option value="automatic" className="bg-slate-800">Automatic</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">Fuel Type</label>
              <select value={form.fuelType} onChange={f('fuelType')} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-blue-400/50">
                {['petrol','diesel','electric','hybrid','cng'].map(t => (
                  <option key={t} value={t} className="bg-slate-800">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Seats" type="number" value={form.seats.toString()} onChange={f('seats')} />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="rounded" />
                <span className="text-sm text-white/80">Available</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-blue-400/50 resize-none" placeholder="Vehicle description..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Hourly Price (₹)" type="number" value={form.pricing.hourly.toString()} onChange={e => setForm(p => ({ ...p, pricing: { ...p.pricing, hourly: +e.target.value } }))} />
            <Input label="Daily Price (₹)" type="number" value={form.pricing.daily.toString()} onChange={e => setForm(p => ({ ...p, pricing: { ...p.pricing, daily: +e.target.value } }))} />
            <Input label="Weekly Price (₹)" type="number" value={form.pricing.weekly.toString()} onChange={e => setForm(p => ({ ...p, pricing: { ...p.pricing, weekly: +e.target.value } }))} />
            <Input label="Monthly Price (₹)" type="number" value={form.pricing.monthly.toString()} onChange={e => setForm(p => ({ ...p, pricing: { ...p.pricing, monthly: +e.target.value } }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.location.city} onChange={e => setForm(p => ({ ...p, location: { ...p.location, city: e.target.value } }))} />
            <Input label="State" value={form.location.state} onChange={e => setForm(p => ({ ...p, location: { ...p.location, state: e.target.value } }))} />
            <Input label="Address" value={form.location.address} onChange={e => setForm(p => ({ ...p, location: { ...p.location, address: e.target.value } }))} />
            <Input label="Location Pincode" value={form.location.pincode} onChange={e => setForm(p => ({ ...p, location: { ...p.location, pincode: e.target.value } }))} maxLength={6} />
          </div>

          {/* Serviceable Pincodes */}
          <div>
            <label className="text-sm font-medium text-white/80 block mb-1.5">Serviceable Pincodes</label>
            <div className="flex gap-2 mb-2">
              <input value={pincodeInput} onChange={e => setPincodeInput(e.target.value)} placeholder="Add pincode" maxLength={6} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-400/50" />
              <Button size="sm" onClick={() => { if (pincodeInput.length === 6) { setForm(p => ({ ...p, serviceablePincodes: [...new Set([...p.serviceablePincodes, pincodeInput])] })); setPincodeInput(''); } }}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.serviceablePincodes.map(p => (
                <span key={p} className="text-xs bg-blue-600/20 border border-blue-400/20 text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                  {p}
                  <button onClick={() => setForm(f => ({ ...f, serviceablePincodes: f.serviceablePincodes.filter(s => s !== p) }))} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium text-white/80 block mb-1.5">Features</label>
            <div className="flex gap-2 mb-2">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="e.g. Air Conditioning" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-400/50" onKeyDown={e => { if (e.key === 'Enter' && featureInput.trim()) { setForm(p => ({ ...p, features: [...p.features, featureInput.trim()] })); setFeatureInput(''); }}} />
              <Button size="sm" onClick={() => { if (featureInput.trim()) { setForm(p => ({ ...p, features: [...p.features, featureInput.trim()] })); setFeatureInput(''); } }}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features.map(feat => (
                <span key={feat} className="text-xs bg-white/10 border border-white/10 text-white/70 px-2 py-1 rounded-full flex items-center gap-1">
                  {feat}
                  <button onClick={() => setForm(f => ({ ...f, features: f.features.filter(s => s !== feat) }))} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-white/80 block mb-1.5">Images</label>
            <label className="flex items-center gap-2 cursor-pointer bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-3 hover:bg-white/10 transition-all w-fit">
              <Image size={16} className="text-white/40" />
              <span className="text-sm text-white/40">{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            {form.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-16 h-12 rounded-lg object-cover" />
                    <button
                      onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i), thumbnailUrl: f.thumbnailUrl === img ? (f.images[0] ?? '') : f.thumbnailUrl }))}
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-white text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={createVehicle.isPending || updateVehicle.isPending}
              fullWidth
            >
              {editing ? 'Save Changes' : 'Create Vehicle'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
