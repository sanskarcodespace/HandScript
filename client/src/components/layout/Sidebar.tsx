'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Pen,
  Settings,
  CreditCard,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
  highlight?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'New Assignment', icon: PlusCircle, route: '/upload', highlight: true },
  { label: 'My Assignments', icon: FileText, route: '/history' },
  { label: 'Handwriting Profiles', icon: Pen, route: '/settings/handwriting' },
];

const accountNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, route: '/settings' },
  { label: 'Billing & Credits', icon: CreditCard, route: '/settings/billing' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:flex">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Pen className="h-5 w-5 text-white" />
          </div>
          HandNote AI
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Main Menu
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                    item.highlight && !isActive && 'text-brand-600 dark:text-brand-400'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 shrink-0 transition-colors',
                      isActive
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
                      item.highlight && !isActive && 'text-brand-500 dark:text-brand-400'
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 h-8 w-1 rounded-r bg-brand-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Account
          </p>
          <nav className="space-y-1">
            {accountNavItems.map((item) => {
              const isActive = pathname === item.route;
              
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 shrink-0 transition-colors',
                      isActive
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 h-8 w-1 rounded-r bg-brand-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom User Area */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Credits</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">{user?.credits || 0} left</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-brand-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, ((user?.credits || 0) / 100) * 100))}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'Admin' : 'Free Plan'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => logout()}
              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
