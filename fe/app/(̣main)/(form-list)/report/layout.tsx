export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 h-full">{children}</div>;
}
