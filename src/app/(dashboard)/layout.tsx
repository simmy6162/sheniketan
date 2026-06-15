export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b px-6 py-4">
        <p className="text-sm font-medium">She Niketan Dashboard</p>
      </header>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
