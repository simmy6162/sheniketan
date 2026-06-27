'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  UserPlus,
  AlertCircle,
  CheckCircle,
  X,
  Users,
  BedDouble,
} from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  occupation?: string;
  age?: number;
}

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  occupied: number;
  status: string;
  residents: Resident[];
}

interface UnallocatedResident {
  id: string;
  name: string;
  email: string;
  occupation?: string;
  age?: number;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Occupied: 'bg-emerald-100 text-emerald-700',
    'Partially Occupied': 'bg-amber-100 text-amber-700',
    Vacant: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Maintenance: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

export function RoomsManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [allocateRoom, setAllocateRoom] = useState<Room | null>(null);
  const [unallocated, setUnallocated] = useState<UnallocatedResident[]>([]);
  const [allocateLoading, setAllocateLoading] = useState(false);

  const [form, setForm] = useState({ roomNumber: '', type: 'Single', capacity: '1' });
  const [formLoading, setFormLoading] = useState(false);

  const loadRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms');
      const data = await res.json();
      if (data.success) setRooms(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnallocated = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms/unallocated');
      const data = await res.json();
      if (data.success) setUnallocated(data.data);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: form.roomNumber,
          type: form.type,
          capacity: Number(form.capacity),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to create room.');
        return;
      }

      setSuccess(data.message);
      setShowAddModal(false);
      setForm({ roomNumber: '', type: 'Single', capacity: '1' });
      await loadRooms();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoom) return;
    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/rooms/${editRoom.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: form.roomNumber,
          type: form.type,
          capacity: Number(form.capacity),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to update room.');
        return;
      }

      setSuccess(data.message);
      setShowEditModal(false);
      setEditRoom(null);
      await loadRooms();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (roomId: string) => {
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to delete room.');
        return;
      }

      setSuccess(data.message);
      setShowDeleteConfirm(null);
      await loadRooms();
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleAllocate = async (residentId: string) => {
    if (!allocateRoom) return;
    setAllocateLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${allocateRoom.id}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residentId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to allocate.');
        return;
      }

      setSuccess(data.message);
      await loadRooms();
      await loadUnallocated();
      const updated = rooms.find((r) => r.id === allocateRoom.id);
      if (updated && updated.occupied + 1 >= updated.capacity) {
        setShowAllocateModal(false);
        setAllocateRoom(null);
      } else {
        setAllocateRoom((prev) =>
          prev ? { ...prev, occupied: prev.occupied + 1 } : prev
        );
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setAllocateLoading(false);
    }
  };

  const handleDeallocate = async (residentId: string) => {
    if (!allocateRoom) return;
    setAllocateLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${allocateRoom.id}/deallocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residentId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to remove resident.');
        return;
      }

      setSuccess(data.message);
      await loadRooms();
      await loadUnallocated();
      setAllocateRoom((prev) =>
        prev ? { ...prev, occupied: Math.max(0, prev.occupied - 1) } : prev
      );
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setAllocateLoading(false);
    }
  };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setForm({ roomNumber: room.roomNumber, type: room.type, capacity: String(room.capacity) });
    setShowEditModal(true);
    setError('');
    setSuccess('');
  };

  const openAllocate = (room: Room) => {
    setAllocateRoom(room);
    setShowAllocateModal(true);
    setError('');
    setSuccess('');
    loadUnallocated();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-brand-sand bg-white p-12 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-brand-purple" />
        <p className="text-sm text-slate-500">Loading rooms…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="h-4 w-4" /></button>
        </div>
      )}

      <section className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-brand-forest">Rooms</h2>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setError(''); setSuccess(''); setForm({ roomNumber: '', type: 'Single', capacity: '1' }); }}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-purple-hover"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <p className="text-sm text-slate-500">No rooms yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-sand text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Room No.</th>
                  <th className="pb-3 pr-4 font-semibold">Type</th>
                  <th className="pb-3 pr-4 font-semibold">Capacity</th>
                  <th className="pb-3 pr-4 font-semibold">Occupied</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-brand-sand/60 last:border-0">
                    <td className="py-3 pr-4 font-medium text-brand-charcoal">{room.roomNumber}</td>
                    <td className="py-3 pr-4 text-slate-600">{room.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{room.capacity}</td>
                    <td className="py-3 pr-4 text-slate-600">{room.occupied}</td>
                    <td className="py-3 pr-4"><StatusBadge status={room.status} /></td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(room)}
                          className="rounded-lg p-1.5 text-brand-purple transition-colors hover:bg-brand-purple-light"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { setShowDeleteConfirm(room.id); setError(''); setSuccess(''); }}
                          className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openAllocate(room)}
                          className="rounded-lg p-1.5 text-brand-purple transition-colors hover:bg-brand-purple-light"
                          title="Allocate"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Partially Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /> Vacant</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Maintenance</span>
        </div>
      </section>

      {/* Add Room Modal */}
      {showAddModal && (
        <Modal onClose={() => { setShowAddModal(false); setError(''); }} title="Add New Room">
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Room Number" value={form.roomNumber} onChange={(v) => setForm((f) => ({ ...f, roomNumber: v }))} placeholder="e.g. 101" required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={['Single', 'Shared']} />
              <Input label="Capacity" type="number" min="1" max="6" value={form.capacity} onChange={(v) => setForm((f) => ({ ...f, capacity: v }))} />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-purple-hover disabled:opacity-60"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {formLoading ? 'Creating…' : 'Add Room'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Room Modal */}
      {showEditModal && editRoom && (
        <Modal onClose={() => { setShowEditModal(false); setEditRoom(null); setError(''); }} title={`Edit Room ${editRoom.roomNumber}`}>
          <form onSubmit={handleEdit} className="space-y-4">
            <Input label="Room Number" value={form.roomNumber} onChange={(v) => setForm((f) => ({ ...f, roomNumber: v }))} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={['Single', 'Shared']} />
              <Input label="Capacity" type="number" min="1" max="6" value={form.capacity} onChange={(v) => setForm((f) => ({ ...f, capacity: v }))} />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-purple-hover disabled:opacity-60"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
              {formLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      {/* Allocate Modal */}
      {showAllocateModal && allocateRoom && (
        <Modal onClose={() => { setShowAllocateModal(false); setAllocateRoom(null); setError(''); }} title={`Allocate Room ${allocateRoom.roomNumber}`}>
          <div className="mb-4 flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-brand-purple" /> {allocateRoom.occupied}/{allocateRoom.capacity} occupied</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-brand-purple" /> {allocateRoom.type}</span>
          </div>

          {allocateRoom.residents.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">Current Residents</p>
              {allocateRoom.residents.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-brand-sand bg-brand-cream px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.occupation || '—'}{r.age ? ` · Age ${r.age}` : ''}</p>
                  </div>
                  <button
                    onClick={() => handleDeallocate(r.id)}
                    disabled={allocateLoading}
                    className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {allocateRoom.occupied < allocateRoom.capacity && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">Allocate Resident</p>
              {unallocated.length === 0 ? (
                <p className="text-sm text-slate-500">No unallocated residents available.</p>
              ) : (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {unallocated.filter((u) => !allocateRoom.residents.some((r) => r.id === u.id)).map((resident) => (
                    <div key={resident.id} className="flex items-center justify-between rounded-xl border border-brand-purple-border bg-brand-lavender px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-brand-charcoal">{resident.name}</p>
                        <p className="text-xs text-slate-500">{resident.occupation || '—'}{resident.age ? ` · Age ${resident.age}` : ''}</p>
                      </div>
                      <button
                        onClick={() => handleAllocate(resident.id)}
                        disabled={allocateLoading}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-purple px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-purple-hover disabled:opacity-60"
                      >
                        <UserPlus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(null)} title="Confirm Deletion">
          <p className="mb-6 text-sm text-slate-600">
            Are you sure you want to delete this room? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDelete(showDeleteConfirm)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Room
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="rounded-xl border border-brand-sand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-charcoal transition-colors hover:bg-brand-cream"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-brand-purple-border bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-serif text-xl text-brand-forest">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full rounded-xl border border-brand-sand bg-brand-cream px-4 py-3 text-sm text-brand-charcoal focus:border-brand-purple focus:outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-brand-sand bg-brand-cream px-4 py-3 text-sm text-brand-charcoal focus:border-brand-purple focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
