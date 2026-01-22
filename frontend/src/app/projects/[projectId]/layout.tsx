export default function ProjectIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Name - Project Status</h1>
        <nav>
          {/* Tabs: Overview | Team | Contract | Schedule | Docs | Settings */}
          <ul className="flex space-x-4">
            <li>Overview</li>
            <li>Team</li>
            <li>Contract</li>
            <li>Schedule</li>
            <li>Docs</li>
            <li>Settings</li>
          </ul>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}