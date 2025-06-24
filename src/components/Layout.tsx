
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Daily', path: '/dashboard' },
    { name: 'Mindspace', path: '/mindspace' },
    { name: 'Progress', path: '/progress' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-swayami-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-swayami-black mb-8">
            Swayami
          </h1>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-swayami-black text-white'
                    : 'text-swayami-light-text hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-sm text-swayami-light-text">
            <div>12:34 PM</div>
            <div>72°F Sunny</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="border-b border-swayami-border bg-white">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-lg font-semibold text-swayami-black">
              {navigation.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-swayami-black rounded-full"></div>
            </div>
          </div>
        </header>
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
