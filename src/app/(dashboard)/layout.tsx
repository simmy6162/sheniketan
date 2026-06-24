import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) redirect('/login');

  const roleLabel =
    session.role === 'admin'
      ? 'Admin'
      : session.role === 'warden'
        ? 'Warden'
        : 'Resident';

  return (
    <div className="flex min-h-full flex-1 flex-col bg-brand-cream">
      <header className="flex items-center justify-between border-b border-brand-sand px-6 py-4">
        <div>
          <p className="text-sm font-medium text-brand-forest">She Niketan Dashboard</p>
          <p className="text-xs text-slate-500">
            {session.name} · {roleLabel}
          </p>
        </div>
        <LogoutButton />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
