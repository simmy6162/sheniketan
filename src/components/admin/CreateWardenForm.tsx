'use client';

import { useEffect, useState } from 'react';
import { Loader2, UserPlus, AlertCircle, CheckCircle, Mail, Lock, User, Phone } from 'lucide-react';

interface WardenRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export function CreateWardenForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [wardens, setWardens] = useState<WardenRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadWardens = async () => {
    setListLoading(true);
    try {
      const res = await fetch('/api/admin/wardens');
      const data = await res.json();
      if (data.success) setWardens(data.data);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadWardens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/wardens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to create warden.');
        return;
      }

      setSuccess(data.message);
      setForm({ name: '', email: '', password: '', phone: '' });
      await loadWardens();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-1">
          <h2 className="font-serif text-xl text-brand-forest">Create Warden Account</h2>
          <p className="text-sm text-slate-500">
            Set the email and password here, then share them with the warden in person.
            Wardens cannot self-register.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="warden-name" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-sage" />
              <input
                id="warden-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Warden full name"
                className="w-full rounded-xl border border-brand-sand bg-brand-cream py-3 pl-10 pr-4 text-sm focus:border-brand-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="warden-email" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-sage" />
              <input
                id="warden-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="warden@example.com"
                className="w-full rounded-xl border border-brand-sand bg-brand-cream py-3 pl-10 pr-4 text-sm focus:border-brand-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="warden-password" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-sage" />
              <input
                id="warden-password"
                type="text"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-brand-sand bg-brand-cream py-3 pl-10 pr-4 text-sm focus:border-brand-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="warden-phone" className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
              Phone <span className="font-normal normal-case text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-sage" />
              <input
                id="warden-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+977 98XXXXXXXX"
                className="w-full rounded-xl border border-brand-sand bg-brand-cream py-3 pl-10 pr-4 text-sm focus:border-brand-sage focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:col-span-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-sage px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-cream transition-colors hover:bg-brand-sage-hover disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {loading ? 'Creating…' : 'Create Warden Account'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-brand-sand bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl text-brand-forest">Active Wardens</h2>

        {listLoading ? (
          <p className="text-sm text-slate-500">Loading wardens…</p>
        ) : wardens.length === 0 ? (
          <p className="text-sm text-slate-500">No warden accounts yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-sand text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Email</th>
                  <th className="pb-3 pr-4 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {wardens.map((w) => (
                  <tr key={w.id} className="border-b border-brand-sand/60 last:border-0">
                    <td className="py-3 pr-4 font-medium text-brand-charcoal">{w.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{w.email}</td>
                    <td className="py-3 pr-4 text-slate-600">{w.phone || '—'}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          w.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {w.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
