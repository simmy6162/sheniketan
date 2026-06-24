export default function ResidentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex-1 p-6">{children}</div>;
}
