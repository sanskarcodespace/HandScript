import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        {
          'rounded-md': variant === 'rect',
          'rounded-full': variant === 'circle',
          'h-4 w-full rounded': variant === 'text',
        },
        className
      )}
      {...props}
    />
  );
};
