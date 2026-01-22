import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Construction', path: '/construction' },
    { name: 'Finance', path: '/finance' },
    { name: 'Login', path: '/login' },
    { name: 'Planning Template', path: '/planning' },
    { name: 'Procurement', path: '/procurement' },
    { name: 'Project', path: '/projects' },
    { name: 'Quality', path: '/quality' },
    { name: 'Reports', path: '/reports' },
  
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Navigation</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.path} className="block px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white text-lg font-bold">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
