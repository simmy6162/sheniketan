import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'admin') redirect('/resident');

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-1">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-brand-cream p-6">{children}</div>
    </div>
  );
}
