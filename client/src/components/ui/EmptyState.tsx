import React from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-800 dark:bg-gray-900/50',
        className
      )}
    >
      {illustration && <div className="mb-6">{illustration}</div>}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const NotebookIllustration = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-300 dark:text-gray-700"
  >
    <rect x="20" y="10" width="80" height="100" rx="8" fill="currentColor" opacity="0.2" />
    <path d="M30 30H90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
    <path d="M30 50H90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 70H70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 20C20 14.4772 24.4772 10 30 10V110C24.4772 110 20 105.523 20 100V20Z" fill="currentColor" />
  </svg>
);
