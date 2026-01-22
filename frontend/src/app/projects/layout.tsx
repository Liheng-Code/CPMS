export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 overflow-hidden">
      <main className="p-4">{children}</main>
    </div>
  );
}