import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import MobileMenu from './MobileMenu';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Goals', path: '/goals' },
    { name: 'Progress', path: '/progress' },
    { name: 'Mindspace', path: '/mindspace' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-50 dark:bg-gray-800 border-r border-swayami-border dark:border-gray-700">
        <div className="p-6">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
              alt="Swayami" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? 'bg-swayami-primary text-white'
                    : 'text-swayami-light-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-sm text-swayami-light-text dark:text-gray-400">
            <div>12:34 PM</div>
            <div>72°F Sunny</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-swayami-border dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-4">
            <img 
              src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
              alt="Swayami" 
              className="h-10 w-auto"
            />
            <div className="flex items-center space-x-4">
              <ProfileDropdown />
              <MobileMenu />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:block border-b border-swayami-border dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-lg font-semibold text-swayami-black dark:text-white">
              {navigation.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <ProfileDropdown />
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
