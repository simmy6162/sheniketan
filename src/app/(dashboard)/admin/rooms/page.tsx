import { RoomsManager } from '@/components/admin/RoomsManager';

export default function AdminRoomsPage() {
  return (
    <section className="space-y-2">
      <div className="mb-6 space-y-1">
        <h1 className="font-serif text-3xl font-light text-brand-forest">Room Management</h1>
        <p className="text-sm text-slate-500">
          Manage rooms, view occupancy, and allocate residents from the table below.
        </p>
      </div>
      <RoomsManager />
    </section>
  );
}
