'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Breadcrumb = () => {
  const pathname = usePathname();
  
  if (!pathname) return null;
  
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');
  
  // Custom mappings for better labels if needed
  const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    upload: 'New Assignment',
    history: 'My Assignments',
    settings: 'Settings',
    handwriting: 'Handwriting Profiles',
    billing: 'Billing & Credits',
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/dashboard" className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          // Try to get mapped label, otherwise capitalize first letter
          const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          // Collapse middle items on mobile (simple CSS approach)
          const isHiddenMobile = !isLast && index > 0;

          return (
            <li key={segment} className={cn('flex items-center', isHiddenMobile && 'hidden sm:flex')}>
              <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-gray-400" />
              {isLast ? (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-sm font-medium text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
