'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, Loader2, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    occupation: '',
    preferredRoomType: 'Single' as 'Single' | 'Shared',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          age: form.age ? Number(form.age) : undefined,
          occupation: form.occupation || undefined,
          preferredRoomType: form.preferredRoomType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 space-y-1">
        <h1 className="font-serif text-3xl font-light text-brand-forest">Create your account</h1>
        <p className="text-sm text-slate-500">Join She Niketan as a resident member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
            <input
              id="reg-name"
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="reg-phone" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Mobile Number <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
            <input
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+977 98XXXXXXXX"
              className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Age + Occupation row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="reg-age" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
              Age
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
              <input
                id="reg-age"
                type="number"
                min={16}
                max={100}
                value={form.age}
                onChange={update('age')}
                placeholder="Age"
                className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-occupation" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
              Occupation
            </label>
            <select
              id="reg-occupation"
              value={form.occupation}
              onChange={update('occupation')}
              className="w-full px-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors"
            >
              <option value="">Select</option>
              <option value="Student">Student</option>
              <option value="Working">Working</option>
              <option value="Intern">Intern</option>
              <option value="Exam Prep">Exam Prep</option>
            </select>
          </div>
        </div>

        {/* Residence Preference */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
            Residence Preference
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="preferredRoomType"
                value="Single"
                checked={form.preferredRoomType === 'Single'}
                onChange={() => setForm((prev) => ({ ...prev, preferredRoomType: 'Single' }))}
                className="w-4 h-4 text-brand-purple accent-brand-purple"
              />
              <span className="text-sm text-brand-charcoal">Single Room</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="preferredRoomType"
                value="Shared"
                checked={form.preferredRoomType === 'Shared'}
                onChange={() => setForm((prev) => ({ ...prev, preferredRoomType: 'Shared' }))}
                className="w-4 h-4 text-brand-purple accent-brand-purple"
              />
              <span className="text-sm text-brand-charcoal">Shared Room</span>
            </label>
          </div>
        </div>

        {/* Password row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.password}
                onChange={update('password')}
                placeholder="Min. 8 chars"
                className="w-full pl-10 pr-10 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-purple transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-confirm" className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal block">
              Confirm
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-sage" />
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="Re-enter"
                className="w-full pl-10 pr-4 py-3.5 border border-brand-sand rounded-xl bg-brand-cream text-sm text-brand-charcoal focus:outline-none focus:border-brand-purple transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Password strength indicator */}
        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[8, 12, 16].map((len, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    form.password.length >= len
                      ? i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-brand-purple' : 'bg-emerald-500'
                      : 'bg-brand-sand'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">
              {form.password.length < 8 ? 'Too short' : form.password.length < 12 ? 'Moderate' : form.password.length < 16 ? 'Strong' : 'Very strong'}
            </p>
          </div>
        )}

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

        <p className="text-[11px] text-gray-400 leading-relaxed">
          By creating an account, you agree to She Niketan&apos;s{' '}
          <span className="text-brand-purple font-medium">Resident Charter</span> and{' '}
          <span className="text-brand-purple font-medium">Privacy Policy</span>.
        </p>

        <button
          type="submit"
          id="register-submit"
          disabled={loading}
          className="w-full bg-brand-purple hover:bg-brand-purple-hover disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {loading ? 'Creating Account…' : 'Create Resident Account'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-purple hover:text-brand-purple-hover font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
