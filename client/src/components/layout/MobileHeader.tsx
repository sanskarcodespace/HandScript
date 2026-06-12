'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, Pen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MobileHeaderProps {
  onOpenDrawer: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenDrawer }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 lg:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          className="-ml-2 inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-600">
            <Pen className="h-4 w-4 text-white" />
          </div>
          HandNote AI
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          <span className="absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
        </button>
        
        <Link href="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </Link>
      </div>
    </header>
  );
};
