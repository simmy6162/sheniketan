import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-light text-brand-forest">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage wardens, residents, rooms, and notices from the sidebar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/wardens"
          className="group rounded-2xl border border-brand-sand bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sage-light text-brand-sage">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="font-serif text-lg text-brand-forest">Warden Accounts</h2>
          <p className="mt-1 text-sm text-slate-500">
            Create login credentials for wardens and share them in person.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-sage group-hover:gap-2 transition-all">
            Manage wardens
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
