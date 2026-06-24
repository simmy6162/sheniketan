'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2, Shield, AlertCircle, CheckCircle } from 'lucide-react';

type LoginRole = 'member' | 'warden';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/resident';

  const [role, setRole] = useState<LoginRole>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      setSuccess(data.message);
      setTimeout(() => {
        router.push(data.data?.redirectTo || redirectTo);
        router.refresh();
      }, 800);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="font-serif text-3xl font-light text-brand-forest">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to your She Niketan portal</p>
      </div>

      {/* Role Toggle */}
      <div className="flex rounded-xl border border-brand-sand overflow-hidden mb-8 bg-brand-beige p-1 gap-1">
        {(['member', 'warden'] as LoginRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              role === r
                ? 'bg-brand-sage text-brand-cream shadow-sm'
                : 'text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            {r === 'member' ? '🏠 Resident' : '🔑 Warden'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-sage transition-colors placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-sage transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          id="login-submit"
          disabled={loading}
          className="w-full bg-brand-sage hover:bg-brand-sage-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-cream py-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-sage/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {loading ? 'Signing In…' : 'Sign In'}
        </button>
      </form>

      {/* Footer links */}
      <div className="mt-8 space-y-4">
        <div className="text-center text-sm text-slate-500">
          New resident?{' '}
          <Link href="/register" className="text-brand-sage hover:text-brand-forest font-semibold transition-colors">
            Create an account
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-brand-sand" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-[1px] bg-brand-sand" />
        </div>
        <Link
          href="/auth/admin"
          className="flex items-center justify-center gap-2 w-full py-3 border border-brand-sand rounded-xl text-xs font-semibold text-brand-forest uppercase tracking-wider hover:bg-brand-beige transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-brand-sage" />
          Admin Portal Login
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
