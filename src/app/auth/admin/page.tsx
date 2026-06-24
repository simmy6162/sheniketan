'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, KeyRound, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminKey }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Access denied. Please verify your credentials.');
        return;
      }

      setSuccess(data.message);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-sage/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-forest/40 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Top icon + title */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-forest border border-brand-sage/30 flex items-center justify-center mx-auto shadow-xl shadow-brand-sage/10">
            <ShieldCheck className="w-8 h-8 text-brand-sage" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-light text-white">Admin Portal</h1>
            <p className="text-sm text-brand-sage-border mt-1">She Niketan — Restricted Access</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-brand-forest-dark border border-brand-sage/20 rounded-2xl p-8 shadow-2xl space-y-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-[11px] uppercase tracking-wider font-semibold text-brand-sage-border block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="root@gmail.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-brand-forest border border-brand-sage/20 text-sm text-white placeholder:text-brand-sage-border/50 focus:outline-none focus:border-brand-sage transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-[11px] uppercase tracking-wider font-semibold text-brand-sage-border block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-brand-forest border border-brand-sage/20 text-sm text-white placeholder:text-brand-sage-border/50 focus:outline-none focus:border-brand-sage transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-sage-border hover:text-brand-sage transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Admin Key */}
            <div className="space-y-1.5">
              <label htmlFor="admin-key" className="text-[11px] uppercase tracking-wider font-semibold text-brand-sage-border block">
                Admin Access Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
                <input
                  id="admin-key"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Secret access key (if configured)"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-brand-forest border border-brand-sage/20 text-sm text-white placeholder:text-brand-sage-border/50 focus:outline-none focus:border-brand-sage transition-colors"
                />
              </div>
              <p className="text-[10px] text-brand-sage-border/60 pl-1">
                Leave blank if ADMIN_SECRET is not set in your environment.
              </p>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 text-red-300 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 rounded-xl px-4 py-3 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-submit"
              disabled={loading}
              className="w-full bg-brand-sage hover:bg-brand-sage-hover disabled:opacity-50 disabled:cursor-not-allowed text-brand-cream py-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-sage/20 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {loading ? 'Verifying…' : 'Access Admin Portal'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-brand-sage/20" />
            <span className="text-[10px] text-brand-sage-border/50 uppercase tracking-wider">or</span>
            <div className="flex-1 h-[1px] bg-brand-sage/20" />
          </div>

          <Link
            href="/login"
            className="block text-center text-sm text-brand-sage-border hover:text-white transition-colors"
          >
            ← Back to Resident Login
          </Link>
        </div>

        {/* Warning tag */}
        <p className="text-center text-[10px] text-brand-sage-border/40 mt-6 uppercase tracking-wider">
          Restricted access · Unauthorized attempts are logged
        </p>
      </div>
    </div>
  );
}
