import { CreateWardenForm } from '@/components/admin/CreateWardenForm';

export default function AdminWardensPage() {
  return (
    <section className="space-y-2">
      <div className="mb-6 space-y-1">
        <h1 className="font-serif text-3xl font-light text-brand-forest">Wardens</h1>
        <p className="text-sm text-slate-500">
          Wardens sign in at <span className="font-medium text-brand-forest">/login</span> using
          credentials you create here. There is no public warden registration.
        </p>
      </div>
      <CreateWardenForm />
    </section>
  );
}
