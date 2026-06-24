'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Users,
  DoorOpen,
  Megaphone,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/wardens', label: 'Wardens', icon: Shield },
  { href: '/admin/residents', label: 'Residents', icon: Users, disabled: true },
  { href: '/admin/rooms', label: 'Rooms', icon: DoorOpen, disabled: true },
  { href: '/admin/notices', label: 'Notices', icon: Megaphone, disabled: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings, disabled: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-brand-sand bg-brand-beige">
      <div className="border-b border-brand-sand px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-sage">
          Admin Console
        </p>
        <p className="font-serif text-lg text-brand-forest">She Niketan</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, disabled }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);

          if (disabled) {
            return (
              <span
                key={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 cursor-not-allowed"
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                {label}
              </span>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-brand-sage text-brand-cream shadow-sm'
                  : 'text-brand-charcoal hover:bg-brand-sand'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-sand px-5 py-4">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          More features will appear in this sidebar as they are built.
        </p>
      </div>
    </aside>
  );
}
