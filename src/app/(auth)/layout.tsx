import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'She Niketan – Sign In',
  description: 'Access your She Niketan resident or warden portal.',
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-forest relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-sage/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-sage/15 rounded-full translate-x-1/4 translate-y-1/4 blur-2xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand-sage flex items-center justify-center text-brand-cream font-serif text-xl font-bold">
            S
          </span>
          <div>
            <p className="font-serif text-2xl font-bold text-white leading-none">she niketan</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-sage-border mt-1">Girls' Residence Sanctuary</p>
          </div>
        </div>

        {/* Quote block */}
        <div className="relative space-y-6">
          <div className="w-12 h-[2px] bg-brand-sage" />
          <blockquote className="font-serif text-3xl text-white font-light leading-snug">
            "A place where focus meets<br />safety, and comfort meets<br />
            <span className="italic text-brand-sage-border">sisterhood."</span>
          </blockquote>
          <p className="text-xs text-brand-sage-border/70 tracking-wider uppercase">
            Autonomy-First Residency
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative flex flex-wrap gap-2">
          {['Biometric Security', 'Warden Support', 'Smart Notices', 'Travel Logs'].map((f) => (
            <span key={f} className="px-3 py-1.5 bg-brand-sage/20 border border-brand-sage/30 rounded-full text-[10px] text-brand-sage-border uppercase tracking-wider font-semibold">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right: auth form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <span className="w-9 h-9 rounded-full bg-brand-sage flex items-center justify-center text-brand-cream font-serif text-lg font-bold">S</span>
          <span className="font-serif text-xl font-bold text-brand-forest">she niketan</span>
        </div>
        {children}
      </div>
    </div>
  );
}
