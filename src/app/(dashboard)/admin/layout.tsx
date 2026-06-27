import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'admin' && session.role !== 'warden') redirect('/resident');

  const roleLabel = session.role === 'admin' ? 'Admin' : 'Warden';

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-1">
      <AdminSidebar role={session.role} />
      <div className="flex-1 overflow-auto bg-brand-cream p-6">{children}</div>
    </div>
  );
}
