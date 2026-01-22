import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Digital Construction Management Platform',
  description: 'A comprehensive platform for managing construction projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
