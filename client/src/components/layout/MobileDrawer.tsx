'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Pen,
  Settings,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  X
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

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Close drawer when path changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 flex w-3/4 max-w-sm flex-col bg-white shadow-xl dark:bg-gray-950 lg:hidden"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
              <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white" onClick={onClose}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                  <Pen className="h-5 w-5 text-white" />
                </div>
                HandNote AI
              </Link>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close drawer</span>
              </button>
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
                          'group flex items-center rounded-lg px-3 py-2 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                          item.highlight && !isActive && 'text-brand-600 dark:text-brand-400'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon
                          className={cn(
                            'mr-4 h-6 w-6 shrink-0 transition-colors',
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
                          'group flex items-center rounded-lg px-3 py-2 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-4 h-6 w-6 shrink-0 transition-colors',
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
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Credits</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{user?.credits || 0} left</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, ((user?.credits || 0) / 100) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    aria-label="Toggle dark mode"
                  >
                    {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => logout()}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
